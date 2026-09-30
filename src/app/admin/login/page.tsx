import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="font-serif text-2xl font-semibold text-navy">
            Area riservata
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Accedi per gestire i contenuti del sito
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm next={next ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
