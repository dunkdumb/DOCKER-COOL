import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Briefcase, Book, Calendar, User } from "lucide-react";
import type { Profile } from "@shared/schema";

export default function ProfileDetail() {
  const [, params] = useRoute("/profile/:id");
  const profileId = params?.id;

  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ["/api/profiles", profileId],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${profileId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Profile not found");
        throw new Error("Failed to fetch profile");
      }
      return res.json();
    },
    enabled: !!profileId,
  });

  if (isLoading) {
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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl flex-1">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Profile not found</p>
              <Link href="/profiles">
                <Button className="mt-4 bg-accent text-accent-foreground" data-testid="button-back-to-profiles">Back to Profiles</Button>
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
                <AvatarImage src={profile.photoUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl" data-testid="text-profile-name">
                  {profile.firstName} {profile.lastName}
                </CardTitle>
                <CardDescription className="text-lg mt-1">
                  {profile.age} years old
                </CardDescription>
                <div className="flex gap-2 mt-3 flex-wrap justify-center sm:justify-start">
                  <Badge>{profile.gender}</Badge>
                  <Badge variant="secondary">{profile.denomination}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium" data-testid="text-location">{profile.location}</p>
                </div>
              </div>
              
              {profile.occupation && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium" data-testid="text-occupation">{profile.occupation}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Book className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Denomination</p>
                  <p className="font-medium" data-testid="text-denomination">{profile.denomination}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Profile Created By</p>
                  <p className="font-medium" data-testid="text-created-by">{profile.createdBy}</p>
                </div>
              </div>

              {profile.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {profile.aboutMe && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground" data-testid="text-about">{profile.aboutMe}</p>
              </div>
            )}

            {profile.partnerPreferences && (
              <div>
                <h3 className="font-semibold mb-2">Partner Preferences</h3>
                <p className="text-muted-foreground" data-testid="text-preferences">{profile.partnerPreferences}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
