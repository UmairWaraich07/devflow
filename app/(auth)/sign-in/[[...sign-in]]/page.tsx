import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-content-center min-h-screen">
      <SignIn />;
    </div>
  );
}
