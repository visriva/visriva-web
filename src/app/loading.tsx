export default function Loading() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-px overflow-hidden">
      <div className="h-full w-1/3 animate-[load_1.1s_ease-in-out_infinite] bg-gold" />
    </div>
  );
}
