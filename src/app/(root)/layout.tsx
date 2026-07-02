import { NavBar } from "@/components/nav/nav-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto px-8 py-10 w-full">{children}</div>
    </>
  );
}
