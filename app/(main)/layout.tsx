import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

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
        {children}
        <Footer />
      </main>
    </div>
  );
}
