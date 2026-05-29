export function LegalPageShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 pt-32 pb-24 sm:px-10 lg:pt-40">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Legal
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Last updated {updated}
      </p>
      <div className="prose-zentron mt-10 flex flex-col gap-6 text-[15px] leading-relaxed text-ink/85">
        {children}
      </div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-display text-xl text-ink">{title}</h2>
      <div className="flex flex-col gap-3 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
