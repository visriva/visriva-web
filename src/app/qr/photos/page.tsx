import { redirect } from "next/navigation";

export default function QrPhotosAliasPage() {
  redirect("/qr?tab=photos");
}