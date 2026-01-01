import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(18, "Must be at least 18").max(100, "Invalid age"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  denomination: z.string().min(1, "Denomination is required"),
  location: z.string().min(1, "Location is required"),
  occupation: z.string().optional(),
  aboutMe: z.string().optional(),
  partnerPreferences: z.string().optional(),
  photoUrl: z.string().optional(),
  createdBy: z.enum(["Self", "Parent", "Sibling", "Friend", "Other"], { required_error: "Please select who is creating this profile" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CreateProfile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to create a profile",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isLoading, isAuthenticated, toast]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 25,
      gender: undefined,
      denomination: "",
      location: "",
      occupation: "",
      aboutMe: "",
      partnerPreferences: "",
      photoUrl: "",
      createdBy: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await apiRequest("POST", "/api/profiles", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile created!",
        description: "Your profile has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      setLocation("/profiles");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Create Profile</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Profile</CardTitle>
            <CardDescription>
              Fill in the details below. Parents and well-wishers can create profiles on behalf of their loved ones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="createdBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who is creating this profile?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-created-by">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Self">Self</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-first-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-last-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-age" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denomination</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Catholic, Protestant, Orthodox" {...field} data-testid="input-denomination" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-occupation" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} data-testid="input-photo-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself or the person you're creating this profile for..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-about"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partnerPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the ideal partner..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-preferences"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending ? "Creating..." : "Create Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
