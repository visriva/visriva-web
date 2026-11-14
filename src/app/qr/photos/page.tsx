import { redirect } from "next/navigation";

/** Legacy alias — no query params; full gatekeeper runs on every load. */
export default function QrPhotosAliasPage() {
  redirect("/qr");
}