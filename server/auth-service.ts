import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, otpCodes } from "@shared/models/auth";
import { eq, and, gt } from "drizzle-orm";
import { sendEmail as sendGmailEmail } from "./gmail";

const SALT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOTP(email: string, type: 'login' | 'register' | 'reset'): Promise<string> {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  
  await db.insert(otpCodes).values({
    email,
    code,
    type,
    expiresAt,
    used: false,
  });
  
  return code;
}

export async function verifyOTP(email: string, code: string, type: string): Promise<boolean> {
  const now = new Date();
  
  const [otp] = await db.select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.email, email),
        eq(otpCodes.code, code),
        eq(otpCodes.type, type),
        eq(otpCodes.used, false),
        gt(otpCodes.expiresAt, now)
      )
    )
    .limit(1);
  
  if (!otp) return false;
  
  await db.update(otpCodes)
    .set({ used: true })
    .where(eq(otpCodes.id, otp.id));
  
  return true;
}

export async function sendOTPEmail(email: string, code: string, type: 'login' | 'register' | 'reset'): Promise<void> {
  const subjects = {
    login: 'Your Login Verification Code',
    register: 'Verify Your Email Address',
    reset: 'Password Reset Code',
  };
  
  const htmlMessages = {
    login: `<h2>Your Verification Code</h2><p>Your verification code for NRI Christian Matrimony is:</p><h1 style="font-size: 32px; letter-spacing: 5px; color: #1e3a5f;">${code}</h1><p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
    register: `<h2>Welcome to NRI Christian Matrimony!</h2><p>Your verification code is:</p><h1 style="font-size: 32px; letter-spacing: 5px; color: #1e3a5f;">${code}</h1><p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
    reset: `<h2>Password Reset</h2><p>Your password reset code for NRI Christian Matrimony is:</p><h1 style="font-size: 32px; letter-spacing: 5px; color: #1e3a5f;">${code}</h1><p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p><p><em>If you did not request this, please ignore this email.</em></p>`,
  };
  
  await sendGmailEmail(email, subjects[type], htmlMessages[type]);
}

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function findUserByGoogleId(googleId: string) {
  const [user] = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
  return user;
}

export async function createUser(data: {
  email: string;
  passwordHash?: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  emailVerified?: boolean;
}) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function updateUser(id: string, data: Partial<{
  passwordHash: string;
  googleId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  emailVerified: boolean;
}>) {
  const [user] = await db.update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}
