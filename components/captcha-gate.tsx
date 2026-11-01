"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import TurnstileWidget from "@/components/turnstile-widget";
import { hintClass } from "@/components/form-fields";

/** Shown above a form until the visitor passes the captcha. The token is
    checked by /api/verify-captcha before `onVerified` fires.
    `section` matches the numbered FormSection steps; `inline` is a compact
    bar for narrow columns such as the contact form. */
export default function CaptchaGate({
  description,
  onVerified,
  layout = "section",
  className = "",
}: {
  description: string;
  onVerified: () => void;
  layout?: "section" | "inline";
  className?: string;
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const handleToken = async (token: string) => {
    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        onVerified();
        return;
      }
      setError(data.message || "Verification failed. Please try again.");
    } catch {
      setError("Could not verify. Check your connection and try again.");
    }

    setIsVerifying(false);
    setResetKey((key) => key + 1);
  };

  const heading = (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
        Before you start
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[#1F447B]">
        Verify you&apos;re human
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[#324A6D]/70">
        {description}
      </p>
    </div>
  );

  const widget = (
    <TurnstileWidget
      onVerify={handleToken}
      onError={() =>
        setError(
          "The verification check couldn't load. Please refresh the page and try again.",
        )
      }
      resetKey={resetKey}
    />
  );

  const status = (
    <>
      {isVerifying && (
        <p className={`flex items-center gap-2 ${hintClass}`}>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Verifying…
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm font-medium text-[#E53935]">
          {error}
        </p>
      )}
    </>
  );

  if (layout === "inline") {
    return (
      <div className={`space-y-3 border-b border-[#1F447B] pb-6 ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 max-w-xs">{heading}</div>
          {widget}
        </div>
        {status}
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 border-t border-[#1F447B] pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-12 ${className}`}
    >
      {heading}
      <div className="min-w-0 space-y-3">
        {widget}
        {status}
      </div>
    </div>
  );
}

/** Wraps a form so it shows greyed out, with every control disabled, until
    the captcha above it passes. */
export function CaptchaLocked({
  unlocked,
  children,
}: {
  unlocked: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      disabled={!unlocked}
      className={`min-w-0 transition-[opacity,filter] duration-500 ${
        unlocked ? "" : "pointer-events-none select-none opacity-40 grayscale"
      }`}
    >
      {children}
    </fieldset>
  );
}
