import type { MoodId } from "@/lib/moods";

export function MoodSection({
  mood,
  children,
  className = "",
  id,
}: {
  mood: MoodId;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} data-mood={mood} className={`mood-canvas mood-${mood} ${className}`}>
      {children}
    </section>
  );
}
