import { instrumentSans, publicSans } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "@/app/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={cn(publicSans.variable, instrumentSans.variable, "font-sans", geist.variable)}
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