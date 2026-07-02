export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full sm:max-w-md">{children}</div>
    </div>
  );
}
