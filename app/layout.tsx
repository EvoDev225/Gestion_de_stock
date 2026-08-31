import { instrumentSans, publicSans } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={cn(publicSans.variable, instrumentSans.variable, "font-sans")}
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