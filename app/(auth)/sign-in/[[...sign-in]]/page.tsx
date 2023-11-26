import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="grid place-content-center min-h-screen py-6">
      <SignIn />;
    </section>
  );
}
