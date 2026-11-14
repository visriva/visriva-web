import { Footer } from "@/components/Footer";
import { getSiteGlobals } from "@/lib/site-globals";

export async function FooterServer() {
  const globals = await getSiteGlobals();
  return <Footer globals={globals} />;
}