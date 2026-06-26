import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  component: SignupRedirect,
});

function SignupRedirect() {
  return null;
}
