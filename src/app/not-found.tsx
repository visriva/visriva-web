import { GoldLink } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-[80svh] flex-col items-start justify-end px-5 pb-24 pt-36 sm:px-10 lg:px-16">
      <p className="type-eyebrow">404</p>
      <h1 className="type-display-italic mt-4 max-w-3xl text-6xl leading-none text-cream sm:text-8xl">
        This room is empty.
      </h1>
      <p className="mt-6 max-w-md text-mist/80">
        The page is not on the floor plan. The stations still are.
      </p>
      <div className="mt-8">
        <GoldLink href="/">Return home</GoldLink>
      </div>
    </main>
  );
}
