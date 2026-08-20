// app/admin/login/page.tsx
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Admin Login — Jamora Vibes",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f1ec] px-6 font-sans">
      <div className="w-full max-w-sm border border-ink/10 bg-white p-8">
        <span className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Jamora <span className="text-brass">Admin</span>
        </span>
        <p className="mt-2 font-sans text-sm text-ink/50">Enter the admin password to continue.</p>

        <LoginForm next={next} />
      </div>
    </div>
  );
}
