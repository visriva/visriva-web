"use client";

import Link from "next/link";
import { useState } from "react";
import type { WebsitePage } from "@/lib/website-pages";

export function AdminWebsitePages({pages}:{pages:WebsitePage[]}) {
  const [selected,setSelected]=useState(pages[0]?.slug??"");
  const [form,setForm]=useState<WebsitePage|null>(pages[0]??null);
  const [pending,setPending]=useState(false);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  function choose(slug:string){
    const page=pages.find(item=>item.slug===slug);
    if(page){setSelected(slug);setForm({...page});setNotice("");setError("");}
  }
  function field<K extends keyof WebsitePage>(key:K,value:WebsitePage[K]){
    setForm(current=>current?({...current,[key]:value}):current);
  }
  async function save(event:React.FormEvent){
    event.preventDefault();
    if(!form)return;
    setPending(true);setNotice("");setError("");
    const response=await fetch("/api/admin/website-pages",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const body=await response.json();
    setPending(false);
    if(!response.ok){setError(body.error??"Could not save page.");return;}
    setForm(body.page);setNotice("Page saved. Published changes are now live.");
  }
  if(!form)return <p className="text-mist">No page records found. Apply the website pages migration first.</p>;
  const input="field mt-2";
  return <div className="grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
    <aside className="rounded-2xl border border-gold/20 bg-emerald/20 p-4">
      <p className="font-royal text-[10px] uppercase tracking-[.24em] text-gold">Website content</p>
      <h1 className="mt-2 font-display text-3xl italic text-cream">Pages</h1>
      <nav className="mt-5 grid gap-1">{pages.map(page=><button key={page.slug} type="button" onClick={()=>choose(page.slug)} className={`flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${selected===page.slug?"border border-gold/40 bg-gold/10 text-cream":"text-mist hover:bg-white/5"}`}><span>{page.name}</span><span className="text-[9px] uppercase tracking-wider text-gold">{page.status}</span></button>)}</nav>
      <Link href="/" target="_blank" className="mt-6 inline-block text-xs text-champagne underline">View live website ↗</Link>
    </aside>
    <form onSubmit={save} className="min-w-0 space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-royal text-[10px] uppercase tracking-[.24em] text-gold">Page editor · /{form.slug==="home"?"":form.slug}</p><h2 className="mt-2 font-display text-4xl italic text-cream">{form.name}</h2></div><select className="field max-w-44" value={form.status} onChange={e=>field("status",e.target.value as WebsitePage["status"])}><option value="draft">Draft</option><option value="published">Published</option></select></div>
      <section className="rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7"><p className="section-kicker">01 · Hero section</p><div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-mist">Page display name<input className={input} value={form.name} onChange={e=>field("name",e.target.value)}/></label>
        <label className="text-sm text-mist">Eyebrow<input className={input} value={form.eyebrow} onChange={e=>field("eyebrow",e.target.value)}/></label>
        <label className="text-sm text-mist">Main heading<input className={input} value={form.hero_title} onChange={e=>field("hero_title",e.target.value)}/></label>
        <label className="text-sm text-mist">Highlighted heading<input className={input} value={form.hero_accent} onChange={e=>field("hero_accent",e.target.value)}/></label>
        <label className="text-sm text-mist md:col-span-2">Hero description<textarea className={input+" min-h-28"} value={form.hero_description} onChange={e=>field("hero_description",e.target.value)}/></label>
        <label className="text-sm text-mist">Hero image path<input className={input} placeholder="/images/your-image.webp" value={form.hero_image} onChange={e=>field("hero_image",e.target.value)}/></label>
        <label className="text-sm text-mist">Hero image alt text<input className={input} value={form.hero_alt} onChange={e=>field("hero_alt",e.target.value)}/></label>
      </div></section>
      <section className="rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7"><p className="section-kicker">02 · Intro section</p><div className="mt-5 grid gap-4"><label className="text-sm text-mist">Intro heading<input className={input} value={form.intro_title} onChange={e=>field("intro_title",e.target.value)}/></label><label className="text-sm text-mist">Intro content<textarea className={input+" min-h-32"} value={form.intro_copy} onChange={e=>field("intro_copy",e.target.value)}/></label></div></section>
      <section className="rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7"><p className="section-kicker">03 · Closing call to action</p><div className="mt-5 grid gap-4"><label className="text-sm text-mist">Closing heading<input className={input} value={form.closing_title} onChange={e=>field("closing_title",e.target.value)}/></label><label className="text-sm text-mist">Closing content<textarea className={input+" min-h-28"} value={form.closing_copy} onChange={e=>field("closing_copy",e.target.value)}/></label></div></section>
      <section className="rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7"><p className="section-kicker">04 · Search engine optimisation</p><div className="mt-5 grid gap-4"><label className="text-sm text-mist">SEO title<input className={input} maxLength={70} value={form.seo_title} onChange={e=>field("seo_title",e.target.value)}/><span className="mt-1 block text-xs text-mist/60">{form.seo_title.length}/70 characters</span></label><label className="text-sm text-mist">SEO description<textarea className={input+" min-h-24"} maxLength={160} value={form.seo_description} onChange={e=>field("seo_description",e.target.value)}/><span className="mt-1 block text-xs text-mist/60">{form.seo_description.length}/160 characters</span></label><label className="text-sm text-mist">Social share image path<input className={input} value={form.og_image} onChange={e=>field("og_image",e.target.value)}/></label></div></section>
      {error?<p role="alert" className="text-sm text-red-300">{error}</p>:null}{notice?<p role="status" className="text-sm text-emerald-300">{notice}</p>:null}
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-mist">Drafts stay out of public page rendering. Publish when ready.</p><button disabled={pending} className="liquid-button rounded-full px-7 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50">{pending?"Saving…":"Save page changes ↗"}</button></div>
    </form>
  </div>;
}
