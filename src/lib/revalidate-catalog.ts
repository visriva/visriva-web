import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { SERVICE_CATALOG_TAG } from "@/lib/services-catalog";

export function revalidatePublicServices() {
  revalidateTag(SERVICE_CATALOG_TAG, "max");
  for (const path of ["/", "/photo-booths", "/ai-merchandise", "/games-vr", "/quote"]) {
    revalidatePath(path);
  }
}
