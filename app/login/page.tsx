import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/21862234/pexels-photo-21862234.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
