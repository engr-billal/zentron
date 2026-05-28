import type { Tables } from "@/types/database";

type Contract = Tables<"contracts">;

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function ContractDetail({ contract }: { contract: Contract }) {
  return (
    <div className="flex flex-col gap-8">
      <Block title="Scope">
        <p className="text-pretty whitespace-pre-line text-sm leading-relaxed text-ink/90">
          {contract.scope}
        </p>
      </Block>

      <Block title="Schedule & fee">
        <Row
          label="Total fee"
          value={formatMoney(contract.total_fee_cents, contract.currency)}
        />
        <Row label="Currency" value={contract.currency} />
        <Row label="Start date" value={formatDate(contract.start_date)} />
        <Row label="End date" value={formatDate(contract.end_date)} />
      </Block>

      {contract.exclusivity || contract.usage_rights ? (
        <Block title="Terms">
          {contract.exclusivity ? (
            <Row label="Exclusivity" value={contract.exclusivity} />
          ) : null}
          {contract.usage_rights ? (
            <Row label="Usage rights" value={contract.usage_rights} />
          ) : null}
        </Block>
      ) : null}

      <Block title="Signatures">
        <Row
          label="Brand signed"
          value={formatTimestamp(contract.signed_brand_at)}
        />
        <Row
          label="Creator signed"
          value={formatTimestamp(contract.signed_creator_at)}
        />
        {contract.cancelled_at ? (
          <>
            <Row
              label="Cancelled at"
              value={formatTimestamp(contract.cancelled_at)}
            />
            {contract.cancelled_reason ? (
              <Row label="Reason" value={contract.cancelled_reason} />
            ) : null}
          </>
        ) : null}
      </Block>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-brand">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-pretty text-ink/90 whitespace-pre-line">
        {value}
      </span>
    </div>
  );
}
