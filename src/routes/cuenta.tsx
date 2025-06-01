import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cuenta')({
  component: RouteComponent,
})

import { UserProfile, useUser } from "@clerk/clerk-react";

function RouteComponent() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Display loading state
  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  // This component assumes it's rendered within a context where the user is signed in.
  // The parent router or component should enforce this using <SignedIn> or similar logic.
  if (!isSignedIn || !user) {
    // This state should ideally not be reached if route protection is in place.
    // Redirecting or showing a generic error might be appropriate here.
    return <div>User not authenticated. Please sign in.</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <UserProfile />
    </div>
  );
}
