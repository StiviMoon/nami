import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ÑAMI — Que te encuentren y pidan directo a tu WhatsApp",
  description:
    "Para restaurantes y comerciantes: haz que te encuentren y recibe pedidos por WhatsApp. ÑAMI no te cobra comisión en planes Gratis y Plus. Hecho en Colombia.",
  keywords: [
    "restaurantes",
    "comida",
    "delivery",
    "WhatsApp",
    "Colombia",
    "Yumbo",
    "Cali",
  ],
  openGraph: {
    title: "ÑAMI — Que te encuentren y pidan directo a tu WhatsApp",
    description: "ÑAMI no te cobra comisión. Pedidos directos a tu WhatsApp.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeScript = `
    (function(){
      if (typeof document === 'undefined') return;
      try {
        var s = localStorage.getItem('nami-theme');
        var isDark = s === 'dark' || (s !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', !!isDark);
      } catch (e) {}
    })();
  `;

  return (
    <html lang="es" className={`${sora.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-n-0 dark:bg-n-950 text-n-900 dark:text-n-100 font-body antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
