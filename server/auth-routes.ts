import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  hashPassword,
  verifyPassword,
  createOTP,
  verifyOTP,
  sendOTPEmail,
  findUserByEmail,
  findUserByGoogleId,
  createUser,
  updateUser,
} from "./auth-service";
import { storage } from "./storage";

const router = Router();

declare module "express-session" {
  interface SessionData {
    userId?: string;
    pendingEmail?: string;
    pendingAction?: 'login' | 'register' | 'reset';
  }
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const firstName = profile.name?.givenName;
          const lastName = profile.name?.familyName;
          const profileImageUrl = profile.photos?.[0]?.value;

          let user = await findUserByGoogleId(googleId);

          if (!user && email) {
            user = await findUserByEmail(email);
            if (user) {
              user = await updateUser(user.id, { googleId, emailVerified: true });
            }
          }

          if (!user) {
            user = await createUser({
              email: email || "",
              googleId,
              firstName,
              lastName,
              profileImageUrl,
              emailVerified: true,
            });
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user || null);
  } catch (error) {
    done(error);
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const code = await createOTP(email, "register");
    await sendOTPEmail(email, code, "register");

    req.session.pendingEmail = email;
    req.session.pendingAction = "register";

    const passwordHash = await hashPassword(password);
    
    req.session.save(() => {
      res.json({ 
        message: "Verification code sent to your email",
        requiresVerification: true,
        tempData: { email, passwordHash, firstName, lastName }
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register. Please try again." });
  }
});

router.post("/verify-register", async (req: Request, res: Response) => {
  try {
    const { email, code, passwordHash, firstName, lastName } = req.body;

    if (!email || !code || !passwordHash) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const isValid = await verifyOTP(email, code, "register");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    const user = await createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      emailVerified: true,
    });

    req.session.userId = user.id;
    await storage.logUserLogin(user.id, email, email);

    req.session.save(() => {
      res.json({ message: "Registration successful", user: { id: user.id, email: user.email } });
    });
  } catch (error) {
    console.error("Verify registration error:", error);
    res.status(500).json({ message: "Failed to complete registration" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = user.id;
    await storage.logUserLogin(user.id, user.email || email, user.email || email);

    req.session.save(() => {
      res.json({ 
        message: "Login successful", 
        user: { 
          id: user.id, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        } 
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login. Please try again." });
  }
});

router.post("/login-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const code = await createOTP(email, "login");
    await sendOTPEmail(email, code, "login");

    req.session.pendingEmail = email;
    req.session.pendingAction = "login";

    req.session.save(() => {
      res.json({ message: "Verification code sent to your email", requiresVerification: true });
    });
  } catch (error) {
    console.error("Login OTP error:", error);
    res.status(500).json({ message: "Failed to send verification code" });
  }
});

router.post("/verify-login-otp", async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const isValid = await verifyOTP(email, code, "login");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.userId = user.id;
    await storage.logUserLogin(user.id, user.email || email, user.email || email);

    req.session.save(() => {
      res.json({ 
        message: "Login successful", 
        user: { 
          id: user.id, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        } 
      });
    });
  } catch (error) {
    console.error("Verify login OTP error:", error);
    res.status(500).json({ message: "Failed to verify code" });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.json({ message: "If an account exists, a reset code has been sent" });
    }

    const code = await createOTP(email, "reset");
    await sendOTPEmail(email, code, "reset");

    res.json({ message: "If an account exists, a reset code has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to process request" });
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const isValid = await verifyOTP(email, code, "reset");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordHash = await hashPassword(newPassword);
    await updateUser(user.id, { passwordHash });

    res.json({ message: "Password reset successful. You can now login with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?error=google_failed" }),
  async (req: Request, res: Response) => {
    const user = req.user as any;
    if (user) {
      req.session.userId = user.id;
      await storage.logUserLogin(user.id, user.email || "", user.email || "");
    }
    res.redirect("/");
  }
);

router.get("/user", async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export default router;
