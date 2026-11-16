import Link from "next/link";
import HeaderNav from "@/components/header-nav";

// Shared layout for the legal pages (/privacy, /terms, /cookies). Like the
// long forms, the text sits straight on the page background with no panel
// behind it: sections are split by navy rules, and from lg up the contents
// list stays in view in a sticky column on the left.

export type LegalSection = {
  /** Anchor for the contents list, e.g. "information-we-collect" */
  id: string;
  title: string;
  content: React.ReactNode;
};

const legalDocuments = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;

export type LegalDocumentHref = (typeof legalDocuments)[number]["href"];

// The company details quoted across the three documents
export const COMPANY = {
  name: "Global American LLC",
  addressLines: ["40 North Van Brunt Street, Ste 23", "Englewood, NJ 07631", "USA"],
  phone: "+1 551-205-9492",
  phoneHref: "tel:+15512059492",
} as const;

/** Postal address, phone and contact form link; closes each document */
export function LegalContactDetails() {
  return (
    <address className="not-italic">
      <p>
        <strong>{COMPANY.name}</strong>
        <br />
        {COMPANY.addressLines.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
        Phone: <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
        <br />
        Online: <Link href="/contact">Contact form</Link>
      </p>
    </address>
  );
}

export default function LegalPage({
  current,
  title,
  accent,
  updated,
  intro,
  sections,
}: {
  current: LegalDocumentHref;
  /** Navy part of the heading, e.g. "Privacy" */
  title: string;
  /** Orange part of the heading, e.g. "Policy" */
  accent: string;
  /** Shown as "Last updated", e.g. "November 16, 2026" */
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <HeaderNav />
      <main className="relative flex-1">
        <section className="pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl md:mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
                Legal
              </p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">
                <span className="text-[#1F447B]">{title}</span>{" "}
                <span className="text-[#EB993C]">{accent}</span>
              </h1>
              <p className="mt-4 text-sm font-semibold text-[#1F447B]">
                Last updated: {updated}
              </p>
              <div className="legal-prose mt-4 text-lg">{intro}</div>

              {/* Switch between the three documents */}
              <nav aria-label="Legal documents" className="mt-8 flex flex-wrap gap-2">
                {legalDocuments.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={href === current ? "page" : undefined}
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors ${
                      href === current
                        ? "border-[#1F447B] bg-[#1F447B] text-white"
                        : "border-[#1F447B]/25 bg-white text-[#1F447B] hover:border-[#EB993C] hover:text-[#EB993C]"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="grid gap-10 border-t border-[#1F447B] pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-12">
              <nav
                aria-label="On this page"
                className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
                  On this page
                </p>
                <ol className="mt-3 space-y-2">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex gap-2 text-sm font-medium leading-snug text-[#1F447B]/75 transition-colors hover:text-[#EB993C]"
                      >
                        <span className="w-5 shrink-0 tabular-nums text-[#324A6D]/50">
                          {index + 1}.
                        </span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <article className="min-w-0">
                {sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    aria-labelledby={`${section.id}-heading`}
                    className={
                      index === 0 ? "" : "mt-10 border-t border-[#1F447B]/15 pt-10"
                    }
                  >
                    <h2
                      id={`${section.id}-heading`}
                      className="mb-4 text-xl font-semibold text-[#1F447B] md:text-2xl"
                    >
                      <span className="mr-2 tabular-nums text-[#EB993C]">
                        {index + 1}.
                      </span>
                      {section.title}
                    </h2>
                    <div className="legal-prose">{section.content}</div>
                  </section>
                ))}
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
