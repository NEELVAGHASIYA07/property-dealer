import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fieldhouse | Real estate with a pulse",
  description: "Verified luxury homes, apartments, and villas across Gujarat.",
};

export default async function RootLayout({ children }) {
  let initialUser = null;
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("fieldhouse_user")?.value;
    if (raw) {
      initialUser = JSON.parse(decodeURIComponent(raw));
    }
  } catch (e) {}

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers initialUser={initialUser}>
          <Navbar initialUser={initialUser} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
