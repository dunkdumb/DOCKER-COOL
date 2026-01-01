import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Profiles from "@/pages/profiles";
import CreateProfile from "@/pages/create-profile";
import EditProfile from "@/pages/edit-profile";
import ProfileDetail from "@/pages/profile-detail";
import MyProfile from "@/pages/my-profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profiles" component={Profiles} />
      <Route path="/create-profile" component={CreateProfile} />
      <Route path="/edit-profile/:id" component={EditProfile} />
      <Route path="/profile/:id" component={ProfileDetail} />
      <Route path="/my-profile" component={MyProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
