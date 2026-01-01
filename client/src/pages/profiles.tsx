import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Briefcase, Book } from "lucide-react";
import { useState } from "react";
import type { Profile } from "@shared/schema";

export default function Profiles() {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    gender: "",
    denomination: "",
    location: "",
    minAge: "",
    maxAge: "",
  });

  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
  ).toString();

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles", queryString],
    queryFn: async () => {
      const res = await fetch(`/api/profiles${queryString ? `?${queryString}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select
                value={filters.gender}
                onValueChange={(v) => setFilters({ ...filters, gender: v })}
              >
                <SelectTrigger data-testid="select-gender">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Denomination"
                value={filters.denomination}
                onChange={(e) => setFilters({ ...filters, denomination: e.target.value })}
                data-testid="input-denomination"
              />

              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                data-testid="input-location"
              />

              <Input
                type="number"
                placeholder="Min Age"
                value={filters.minAge}
                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                data-testid="input-min-age"
              />

              <Input
                type="number"
                placeholder="Max Age"
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                data-testid="input-max-age"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Link key={profile.id} href={`/profile/${profile.id}`}>
                <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-profile-${profile.id}`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.photoUrl || undefined} />
                        <AvatarFallback>
                          {profile.firstName[0]}{profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {profile.firstName} {profile.lastName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          {profile.age} years old
                        </CardDescription>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary">{profile.gender}</Badge>
                          <Badge variant="outline">{profile.denomination}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                      {profile.occupation && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{profile.occupation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        <span>Created by: {profile.createdBy}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No profiles found. Be the first to create one!</p>
              {isAuthenticated && (
                <Link href="/create-profile">
                  <Button className="mt-4 bg-accent text-accent-foreground" data-testid="button-create-first">Create Profile</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
