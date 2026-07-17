import type { Metadata } from "next";
import "./globals.css";

const assetBase = "https://shorexplorations-guias.freedomlion.chatgpt.site";

export const metadata: Metadata = {
  title: "Portal de Guias | Shorexplorations",
  description: "Asignaciones, buses, puntos de partida y descriptivos operativos para guias.",
  icons: { icon: `${assetBase}/logo-transparent.png`, shortcut: `${assetBase}/logo-transparent.png` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
