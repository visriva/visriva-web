/** Routes that ship their own header, footer, and WhatsApp (immersive studio). */
export function isImmersiveRoute(pathname: string) {
  return pathname === "/" || pathname.startsWith("/live");
}
