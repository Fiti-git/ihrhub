import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IHRHUB Admin | Sign In",
  description: "Sign in to the IHRHUB Admin Dashboard – manage professionals, jobs, and platform activity.",
};

export default function SignIn() {
  return <SignInForm />;
}
