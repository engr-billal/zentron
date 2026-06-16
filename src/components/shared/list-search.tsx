import { Input } from "@/components/ui/input";

type Props = {
  placeholder?: string;
  defaultValue?: string;
  preserveParams?: Record<string, string | undefined>;
};

export function ListSearch({
  placeholder = "Search…",
  defaultValue = "",
  preserveParams,
}: Props) {
  return (
    <form className="mt-6 flex max-w-md gap-2" method="get" role="search">
      {preserveParams
        ? Object.entries(preserveParams).map(([key, value]) =>
            value ? (
              <input key={key} type="hidden" name={key} value={value} />
            ) : null,
          )
        : null}
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-9"
      />
      <button
        type="submit"
        className="rounded-md border border-border bg-card px-3 text-xs font-medium uppercase tracking-[0.12em] text-ink hover:border-brand/40"
      >
        Search
      </button>
    </form>
  );
}
