"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ServiceRow } from "@/lib/service-row";
import type { PublishStatus } from "@/lib/services-types";

type Props = {
  mode: "create" | "edit";
  initial?: ServiceRow;
};

const categories = ["photo-booths", "ai-merchandise", "games"] as const;
const statuses: PublishStatus[] = ["draft", "preview", "published", "archived"];

export function AdminServiceEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    category: initial?.category ?? "photo-booths",
    price_label: initial?.price_label ?? "Price on request",
    from_price: initial?.from_price?.toString() ?? "",
    unit_price: initial?.unit_price?.toString() ?? "",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    sort_order: initial?.sort_order?.toString() ?? "0",
    coming_soon: initial?.coming_soon ?? false,
    footprint: initial?.footprint ?? "",
    guest_moment: initial?.guest_moment ?? "",
    unit_label: initial?.unit_label ?? "",
    duration_minutes: initial?.duration_minutes?.toString() ?? "",
    includes: (initial?.includes ?? []).join("\n"),
    sizes: (initial?.specs?.sizes ?? []).join("\n"),
    colors: (initial?.specs?.colors ?? []).join("\n"),
    image_path: initial?.image_path ?? "",
    publish_status: (initial?.publish_status ?? "draft") as PublishStatus,
  });

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      from_price: form.from_price === "" ? null : Number(form.from_price),
      unit_price: form.unit_price === "" ? null : Number(form.unit_price),
      sort_order: Number(form.sort_order) || 0,
      duration_minutes: form.duration_minutes === "" ? null : Number(form.duration_minutes),
      includes: form.includes.split("\n").map((line) => line.trim()).filter(Boolean),
      specs: {
        sizes: form.sizes.split("\n").map((line) => line.trim()).filter(Boolean),
        colors: form.colors.split("\n").map((line) => line.trim()).filter(Boolean),
      },
    };

    const url = mode === "create" ? "/api/admin/services" : `/api/admin/services/${encodeURIComponent(form.id)}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string; service?: ServiceRow };
    if (!response.ok) {
      setError(body.error || "Could not save.");
      setPending(false);
      return;
    }

    const id = body.service?.id ?? form.id;

    if (imageFile) {
      const imageData = new FormData();
      imageData.set("image", imageFile);
      const imageResponse = await fetch(`/api/admin/services/${encodeURIComponent(id)}/image`, {
        method: "POST",
        body: imageData,
      });
      const imageBody = (await imageResponse.json()) as { error?: string; image_path?: string };
      if (!imageResponse.ok) {
        setError(imageBody.error || "Saved, but image upload failed.");
        setPending(false);
        return;
      }
      if (imageBody.image_path) setField("image_path", imageBody.image_path);
    }

    setMessage("Saved.");
    setPending(false);
    router.replace(`/admin/services/${id}`);
    router.refresh();
  }

  async function setStatus(next: PublishStatus) {
    setPending(true);
    setError("");
    const response = await fetch(`/api/admin/services/${encodeURIComponent(form.id)}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publish_status: next }),
    });
    const body = (await response.json()) as { error?: string; service?: ServiceRow };
    setPending(false);
    if (!response.ok) {
      setError(body.error || "Could not update status.");
      return;
    }
    if (body.service) setField("publish_status", body.service.publish_status);
    setMessage(`Status set to ${next}.`);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-royal text-[0.68rem] uppercase tracking-[0.28em] text-gold">
            {mode === "create" ? "New" : "Edit"}
          </p>
          <h1 className="mt-2 font-display text-5xl italic text-cream">{form.name || "Service"}</h1>
        </div>
        <Link href="/admin/services" className="text-[0.68rem] uppercase tracking-[0.14em] text-champagne hover:underline">
          Back to list
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mode === "create" ? (
          <label className="block text-sm text-mist">
            Id (slug)
            <input className="field mt-2" required value={form.id} onChange={(e) => setField("id", e.target.value)} />
          </label>
        ) : (
          <div className="text-sm text-mist">
            Id <div className="mt-2 font-mono text-cream">{form.id}</div>
          </div>
        )}
        <label className="block text-sm text-mist">
          Name
          <input className="field mt-2" required value={form.name} onChange={(e) => setField("name", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Category
          <select className="field mt-2" value={form.category} onChange={(e) => setField("category", e.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-mist">
          Sort order
          <input className="field mt-2" value={form.sort_order} onChange={(e) => setField("sort_order", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Publish status (saved with form)
          <select
            className="field mt-2"
            value={form.publish_status}
            onChange={(e) => setField("publish_status", e.target.value as PublishStatus)}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-mist">
          Price label
          <input className="field mt-2" value={form.price_label} onChange={(e) => setField("price_label", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          From price (₹)
          <input className="field mt-2" value={form.from_price} onChange={(e) => setField("from_price", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Unit price (₹)
          <input className="field mt-2" value={form.unit_price} onChange={(e) => setField("unit_price", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Unit label
          <input className="field mt-2" value={form.unit_label} onChange={(e) => setField("unit_label", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Duration (minutes)
          <input className="field mt-2" value={form.duration_minutes} onChange={(e) => setField("duration_minutes", e.target.value)} />
        </label>
        <label className="block text-sm text-mist md:col-span-2">
          Summary
          <textarea className="field mt-2 min-h-24" required value={form.summary} onChange={(e) => setField("summary", e.target.value)} />
        </label>
        <label className="block text-sm text-mist md:col-span-2">
          Description
          <textarea className="field mt-2 min-h-24" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </label>
        <label className="block text-sm text-mist md:col-span-2">
          Inclusions (one per line)
          <textarea className="field mt-2 min-h-24" value={form.includes} onChange={(e) => setField("includes", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Footprint
          <input className="field mt-2" value={form.footprint} onChange={(e) => setField("footprint", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Guest moment
          <input className="field mt-2" value={form.guest_moment} onChange={(e) => setField("guest_moment", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Sizes (one per line)
          <textarea className="field mt-2 min-h-20" value={form.sizes} onChange={(e) => setField("sizes", e.target.value)} />
        </label>
        <label className="block text-sm text-mist">
          Colours (one per line)
          <textarea className="field mt-2 min-h-20" value={form.colors} onChange={(e) => setField("colors", e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-sm text-mist md:col-span-2">
          <input type="checkbox" checked={form.coming_soon} onChange={(e) => setField("coming_soon", e.target.checked)} />
          Coming soon (published but not bookable)
        </label>
        <label className="block text-sm text-mist md:col-span-2">
          Image URL or path
          <input className="field mt-2" value={form.image_path} onChange={(e) => setField("image_path", e.target.value)} />
        </label>
        <label className="block text-sm text-mist md:col-span-2">
          Upload / replace image
          <input
            className="mt-2 block text-sm text-champagne"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            disabled={pending || mode === "create"}
            onClick={() => setStatus(status)}
            className={`border px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] ${
              form.publish_status === status ? "border-gold text-gold" : "border-gold/25 text-mist"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-gold-2">{error}</p> : null}
      {message ? <p className="text-sm text-champagne">{message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="border border-gold/50 bg-gold/10 px-6 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-cream disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save service"}
      </button>
    </form>
  );
}
