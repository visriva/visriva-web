import type { MoodId } from "@/lib/moods";

export function MoodSection({
  mood,
  children,
  className = "",
  id,
  unified = true,
}: {
  mood: MoodId;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** When true, keep mood id for semantics but use the shared studio palette. */
  unified?: boolean;
}) {
  return (
    <section
      id={id}
      data-mood={mood}
      className={`mood-canvas mood-${mood} ${unified ? "mood-canvas--studio" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
