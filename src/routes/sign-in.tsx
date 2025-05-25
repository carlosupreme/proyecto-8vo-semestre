import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/clerk-react'



export const Route = createFileRoute('/sign-in')({
  component: SignInPage
})

function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn
          
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-md rounded-lg border p-8",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              formFieldInput: "border-gray-300 focus:border-primary focus:ring-primary",
              footerActionLink: "text-primary hover:text-primary/90",
            }
          }}
        />
      </div>
    </div>
  )
}
