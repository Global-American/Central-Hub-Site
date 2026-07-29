import { NextRequest, NextResponse } from "next/server";

type QuotePayload = {
  shipmentMode?: unknown;
  metadata?: {
    serviceLocation?: unknown;
  };
  [key: string]: unknown;
};

const DEFAULT_BILLING_API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8090"
    : "https://app.itsmartbilling.com";

const BILLING_API_BASE =
  process.env.BILLING_API_BASE || DEFAULT_BILLING_API_BASE;

const BILLING_QUOTES_ENDPOINT =
  process.env.BILLING_QUOTES_ENDPOINT || "/api/public/ship-it-smart/quotes";

const BILLING_QUOTES_SECRET = process.env.BILLING_QUOTES_SECRET || "";

function quoteLocation(payload: QuotePayload) {
  if (payload.metadata?.serviceLocation === "Freight It Smart") {
    return "Freight It Smart";
  }

  if (payload.shipmentMode === "freight") {
    return "Freight It Smart";
  }

  return "Ship It Smart";
}

export async function POST(req: NextRequest) {
  let body: {
    payload?: QuotePayload;
  };

  try {
    body = (await req.json()) as {
      payload?: QuotePayload;
    };
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!body.payload) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation_error",
        message: "Missing payload.",
      },
      { status: 400 },
    );
  }

  const location = quoteLocation(body.payload);
  const billingResponse = await fetch(
    `${BILLING_API_BASE}${BILLING_QUOTES_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(BILLING_QUOTES_SECRET
          ? { "x-ship-it-smart-secret": BILLING_QUOTES_SECRET }
          : {}),
      },
      body: JSON.stringify({
        type_of_form: "quote",
        form_data: body.payload,
        location,
      }),
    },
  );

  if (!billingResponse.ok) {
    const errorText = await billingResponse.text();
    return NextResponse.json(
      {
        ok: false,
        error: "billing_failed",
        message: `Failed to submit quote request: ${billingResponse.statusText}`,
        details: errorText,
      },
      { status: billingResponse.status },
    );
  }

  const contentType = billingResponse.headers.get("content-type") || "";
  const billingResult = contentType.includes("application/json")
    ? await billingResponse.json()
    : await billingResponse.text();

  return NextResponse.json({
    ok: true,
    location,
    data:
      typeof billingResult === "object" && billingResult !== null
        ? (billingResult as { data?: unknown }).data ?? billingResult
        : billingResult,
  });
}
