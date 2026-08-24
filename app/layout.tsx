import { instrumentSans, publicSans } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${publicSans.variable} ${instrumentSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}