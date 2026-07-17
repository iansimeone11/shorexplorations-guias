import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal de Guias | Shorexplorations",
  description: "Asignaciones, buses, puntos de partida y descriptivos operativos para guias.",
  icons: { icon: "/logo.svg", shortcut: "/logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
