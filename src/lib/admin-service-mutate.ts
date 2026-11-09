import "server-only";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePublicServices } from "@/lib/revalidate-catalog";
import type { PublishStatus } from "@/lib/services-types";
import type { ServiceRow, ServiceSpecs } from "@/lib/service-row";

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}$/;

export function cleanServiceId(raw: string) {
  const id = raw.trim().toLowerCase();
  if (!ID_PATTERN.test(id)) return null;
  return id;
}

export type ServiceInput = {
  id: string;
  name: string;
  category: string;
  price_label: string;
  from_price: number | null;
  unit_price: number | null;
  summary: string;
  sort_order: number;
  coming_soon: boolean;
  image_path: string | null;
  includes: string[];
  footprint: string | null;
  guest_moment: string | null;
  unit_label: string | null;
  duration_minutes: number | null;
  description: string | null;
  specs: ServiceSpecs;
  publish_status: PublishStatus;
};

export function parseServiceBody(body: unknown, requireId = true): ServiceInput | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid body." };
  const value = body as Record<string, unknown>;
  const id = requireId ? cleanServiceId(String(value.id ?? "")) : cleanServiceId(String(value.id ?? "")) || "";
  if (requireId && !id) return { error: "Service id must be lowercase letters, numbers, and hyphens." };

  const name = String(value.name ?? "").trim().slice(0, 160);
  const summary = String(value.summary ?? "").trim().slice(0, 2000);
  if (!name || !summary) return { error: "Name and summary are required." };

  const category = String(value.category ?? "ai-merchandise").trim();
  const price_label = String(value.price_label ?? "Price on request").trim().slice(0, 120);
  const from_price = parseOptionalInt(value.from_price);
  const unit_price = parseOptionalInt(value.unit_price);
  const sort_order = parseOptionalInt(value.sort_order) ?? 0;
  const coming_soon = value.coming_soon === true;
  const image_path = cleanOptionalText(value.image_path, 500);
  const footprint = cleanOptionalText(value.footprint, 120);
  const guest_moment = cleanOptionalText(value.guest_moment, 500);
  const unit_label = cleanOptionalText(value.unit_label, 40);
  const description = cleanOptionalText(value.description, 4000);
  const duration_minutes = parseOptionalInt(value.duration_minutes);
  const includes = parseStringArray(value.includes);
  const specs = parseSpecs(value.specs);
  const publish_status = parseStatus(value.publish_status);

  return {
    id: id ?? "",
    name,
    category,
    price_label,
    from_price,
    unit_price,
    summary,
    sort_order,
    coming_soon,
    image_path,
    includes,
    footprint,
    guest_moment,
    unit_label,
    duration_minutes,
    description,
    specs,
    publish_status,
  };
}

function parseOptionalInt(raw: unknown) {
  if (raw === null || raw === undefined || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.round(n);
}

function cleanOptionalText(raw: unknown, max: number) {
  if (raw === null || raw === undefined) return null;
  const text = String(raw).trim();
  if (!text) return null;
  return text.slice(0, max);
}

function parseStringArray(raw: unknown) {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean).slice(0, 40);
  }
  if (typeof raw === "string") {
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 40);
  }
  return [];
}

function parseSpecs(raw: unknown): ServiceSpecs {
  if (!raw || typeof raw !== "object") return {};
  const value = raw as Record<string, unknown>;
  return {
    sizes: parseStringArray(value.sizes),
    colors: parseStringArray(value.colors),
  };
}

function parseStatus(raw: unknown): PublishStatus {
  const allowed: PublishStatus[] = ["draft", "preview", "published", "archived"];
  const status = String(raw ?? "draft") as PublishStatus;
  return allowed.includes(status) ? status : "draft";
}

export async function saveServiceRow(input: ServiceInput, existingId?: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const active = input.publish_status === "published" || input.publish_status === "preview";
  const row = {
    id: existingId ?? input.id,
    name: input.name,
    category: input.category,
    price_label: input.price_label,
    from_price: input.from_price,
    unit_price: input.unit_price,
    summary: input.summary,
    sort_order: input.sort_order,
    active,
    publish_status: input.publish_status,
    coming_soon: input.coming_soon,
    image_path: input.image_path,
    includes: input.includes,
    footprint: input.footprint,
    guest_moment: input.guest_moment,
    unit_label: input.unit_label,
    duration_minutes: input.duration_minutes,
    description: input.description,
    specs: input.specs,
    updated_at: new Date().toISOString(),
    published_at: input.publish_status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = existingId
    ? await supabase.from("services").update(row).eq("id", existingId).select("*").single()
    : await supabase.from("services").insert(row).select("*").single();

  if (error) return { error: error.message };

  if (input.publish_status === "published" && data) {
    await supabase.from("service_versions").insert({
      service_id: row.id,
      snapshot: data,
      published_by: "admin",
    });
    revalidatePublicServices();
  }

  return { data: data as ServiceRow };
}

export async function setServicePublishStatus(id: string, publish_status: PublishStatus) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { data: current, error: readError } = await supabase.from("services").select("*").eq("id", id).single();
  if (readError || !current) return { error: "Service not found." };

  const active = publish_status === "published" || publish_status === "preview";
  const patch = {
    publish_status,
    active,
    updated_at: new Date().toISOString(),
    published_at: publish_status === "published" ? new Date().toISOString() : (current as ServiceRow).published_at,
  };

  const { data, error } = await supabase.from("services").update(patch).eq("id", id).select("*").single();
  if (error) return { error: error.message };

  if (publish_status === "published") {
    await supabase.from("service_versions").insert({
      service_id: id,
      snapshot: data,
      published_by: "admin",
    });
    revalidatePublicServices();
  }

  if (publish_status === "archived" || publish_status === "draft") {
    revalidatePublicServices();
  }

  return { data: data as ServiceRow };
}

export async function uploadServiceImage(id: string, file: File) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const allowed = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
  if (!allowed.has(ext)) return { error: "Use JPEG, PNG, WebP, or GIF." };
  if (file.size > 5 * 1024 * 1024) return { error: "Image must be under 5 MB." };

  const path = `${id}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("service-images").upload(path, buffer, {
    contentType: file.type || `image/${ext}`,
    upsert: true,
  });
  if (uploadError) return { error: uploadError.message };

  const { data: publicUrl } = supabase.storage.from("service-images").getPublicUrl(path);
  const image_path = publicUrl.publicUrl;

  const { error: updateError } = await supabase
    .from("services")
    .update({ image_path, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) return { error: updateError.message };

  revalidatePublicServices();
  return { image_path };
}
