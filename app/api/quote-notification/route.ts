import { NextRequest, NextResponse } from "next/server";

type QuotePayload = Record<string, unknown>;

function toPrettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function buildEmailBody(formData: QuotePayload): {
  text: string;
  html: string;
} {
  const from = (formData.from as Record<string, unknown> | undefined) ?? {};
  const to = (formData.to as Record<string, unknown> | undefined) ?? {};
  const packages = Array.isArray(formData.packages) ? formData.packages : [];

  const text = [
    "A new quote request was created.",
    "",
    `From: ${String(from.country ?? "N/A")} ${String(from.postcode ?? "")}`.trim(),
    `To: ${String(to.country ?? "N/A")} ${String(to.postcode ?? "")}`.trim(),
    `Packages: ${packages.length}`,
    "",
    "Full payload:",
    toPrettyJson(formData),
  ].join("\n");

  const html = `
    <h2>New Quote Request</h2>
    <p>A new quote request was created.</p>
    <ul>
      <li><strong>From:</strong> ${String(from.country ?? "N/A")} ${String(from.postcode ?? "")}</li>
      <li><strong>To:</strong> ${String(to.country ?? "N/A")} ${String(to.postcode ?? "")}</li>
      <li><strong>Packages:</strong> ${packages.length}</li>
    </ul>
    <p><strong>Full payload:</strong></p>
    <pre>${toPrettyJson(formData)}</pre>
  `;

  return { text, html };
}

export async function POST(req: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_config",
        message: "RESEND_API_KEY must be configured.",
      },
      { status: 500 },
    );
  }

  let body: {
    form_data?: QuotePayload;
    booking_id?: string;
    location?: string;
  };
  try {
    body = (await req.json()) as {
      form_data?: QuotePayload;
      booking_id?: string;
      location?: string;
    };
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!body.form_data) {
    return NextResponse.json(
      { ok: false, error: "validation_error", message: "Missing form_data." },
      { status: 400 },
    );
  }

  const { text, html } = buildEmailBody(body.form_data);

  const subjectParts = ["New quote request - Global American"];
  if (body.booking_id) subjectParts.push(`Booking ID: ${body.booking_id}`);
  if (body.location) subjectParts.push(`Location: ${body.location}`);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["ae@globalamerican.us"],
        subject: subjectParts.join(" | "),
        text,
        html,
      }),
    });

    if (!response.ok) {
      const providerText = await response.text();
      return NextResponse.json(
        {
          ok: false,
          error: "provider_error",
          message: providerText || "Failed to send email.",
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { id?: string };
    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "send_failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}
