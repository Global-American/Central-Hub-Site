import { NextRequest, NextResponse } from "next/server";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Cloudflare's published test secret (always passes), paired with the test
// site key the widget uses in development.
const DEV_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

const TURNSTILE_SECRET_KEY =
  process.env.TURNSTILE_SECRET_KEY ||
  (process.env.NODE_ENV === "development" ? DEV_TEST_SECRET_KEY : "");

type SiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(req: NextRequest) {
  if (!TURNSTILE_SECRET_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: "captcha_not_configured",
        message: "Verification is not available right now.",
      },
      { status: 500 },
    );
  }

  let token = "";
  try {
    const body = (await req.json()) as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    // Falls through to the missing-token response below
  }

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "missing_token", message: "Verification required." },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    secret: TURNSTILE_SECRET_KEY,
    response: token,
  });
  const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (remoteIp) params.set("remoteip", remoteIp);

  let result: SiteverifyResponse;
  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body: params });
    result = (await res.json()) as SiteverifyResponse;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "captcha_unreachable",
        message: "Could not reach the verification service. Please try again.",
      },
      { status: 502 },
    );
  }

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "captcha_failed",
        message: "Verification failed. Please try again.",
        codes: result["error-codes"] ?? [],
      },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true });
}
