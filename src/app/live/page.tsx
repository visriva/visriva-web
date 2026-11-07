import { permanentRedirect } from "next/navigation";

/** Former live-studio URL — homepage is now the interactive platform. */
export default function LiveLegacyRedirect() {
  permanentRedirect("/");
}
