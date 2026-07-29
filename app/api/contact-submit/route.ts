import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  selectedBrands?: string[];
};

const DEFAULT_BILLING_API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8090"
    : "https://app.itsmartbilling.com";

const BILLING_API_BASE =
  process.env.BILLING_API_BASE || DEFAULT_BILLING_API_BASE;

const BILLING_CONTACT_ENDPOINT =
  process.env.BILLING_CONTACT_ENDPOINT || "/api/public/ship-it-smart/contact";

const BILLING_QUOTES_SECRET = process.env.BILLING_QUOTES_SECRET || "";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = asString(payload.name);
  const email = asString(payload.email);
  const phone = asString(payload.phone);

  if (!name) {
    return NextResponse.json(
      { ok: false, error: "validation_error", message: "Name is required." },
      { status: 400 },
    );
  }

  if (!email && !phone) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation_error",
        message: "Email or phone is required.",
      },
      { status: 400 },
    );
  }

  const billingResponse = await fetch(
    `${BILLING_API_BASE}${BILLING_CONTACT_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(BILLING_QUOTES_SECRET
          ? { "x-ship-it-smart-secret": BILLING_QUOTES_SECRET }
          : {}),
      },
      body: JSON.stringify({
        type_of_form: "contact",
        form_data: {
          name,
          email,
          phone,
          company: asString(payload.company),
          message: asString(payload.message),
          selectedBrands: Array.isArray(payload.selectedBrands)
            ? payload.selectedBrands
            : [],
        },
        location: "Ship It Smart",
      }),
    },
  );

  if (!billingResponse.ok) {
    const errorText = await billingResponse.text();
    return NextResponse.json(
      {
        ok: false,
        error: "billing_failed",
        message: `Failed to submit contact request: ${billingResponse.statusText}`,
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
    data:
      typeof billingResult === "object" && billingResult !== null
        ? (billingResult as { data?: unknown }).data ?? billingResult
        : billingResult,
  });
}
