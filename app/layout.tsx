import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Helper",
  description:
    "Learn C++/OOP, IT networking, Economics II, Discrete Mathematics, and Statistics with real interactive simulations, real errors, and plain-language explanations.",
};

// Runs before paint so the resolved theme (saved choice, or system preference as
// a fallback) is set as an explicit attribute with no flash of the wrong palette.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var resolved = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", resolved);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-page text-body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
