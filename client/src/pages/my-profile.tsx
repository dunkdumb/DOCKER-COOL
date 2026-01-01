import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Briefcase, Book, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyProfile() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to view your profile",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [authLoading, isAuthenticated, toast]);

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
    enabled: isAuthenticated,
  });

  const myProfile = profiles?.find(p => p.userId === user?.id);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/profiles/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Profile deleted",
        description: "Your profile has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl flex-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
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

  if (!myProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl flex-1">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't created a profile yet.</p>
              <Link href="/create-profile">
                <Button className="bg-accent text-accent-foreground" data-testid="button-create-profile">Create Your Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl flex-1">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={myProfile.photoUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {myProfile.firstName[0]}{myProfile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <CardTitle className="text-2xl" data-testid="text-profile-name">
                  {myProfile.firstName} {myProfile.lastName}
                </CardTitle>
                <CardDescription className="text-lg mt-1">
                  {myProfile.age} years old
                </CardDescription>
                <div className="flex gap-2 mt-3 flex-wrap justify-center sm:justify-start">
                  <Badge>{myProfile.gender}</Badge>
                  <Badge variant="secondary">{myProfile.denomination}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" data-testid="button-delete-profile">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Your profile will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(myProfile.id)}
                        data-testid="button-confirm-delete"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{myProfile.location}</p>
                </div>
              </div>
              
              {myProfile.occupation && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">{myProfile.occupation}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Book className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Denomination</p>
                  <p className="font-medium">{myProfile.denomination}</p>
                </div>
              </div>
            </div>

            {myProfile.aboutMe && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{myProfile.aboutMe}</p>
              </div>
            )}

            {myProfile.partnerPreferences && (
              <div>
                <h3 className="font-semibold mb-2">Partner Preferences</h3>
                <p className="text-muted-foreground">{myProfile.partnerPreferences}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
