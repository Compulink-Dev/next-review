import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";

export const metadata: Metadata = {
  title: "Employee Health Review",
  description: "Employee Health Review",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main className="">
        <Header />
        <Hero />
        {children}
        <Footer />
      </main>
    </div>
  );
}
