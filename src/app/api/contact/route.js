import { Resend } from "resend";

const RECIPIENT = "mcvicky2601@gmail.com";
const TOPICS = new Set([
    "Report an error",
    "Suggest a topic",
    "General feedback",
    "Something else",
]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function POST(request) {
    let payload;
    try {
        payload = await request.json();
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const name = String(payload?.name ?? "").trim();
    const email = String(payload?.email ?? "").trim();
    const topic = String(payload?.topic ?? "").trim();
    const message = String(payload?.message ?? "").trim();

    const fields = {};
    if (!name) fields.name = "Name is required.";
    else if (name.length > 200) fields.name = "Name must be 200 characters or fewer.";
    if (!email) fields.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) fields.email = "Enter a valid email address.";
    if (!topic || !TOPICS.has(topic)) fields.topic = "Choose a topic.";
    if (!message) fields.message = "Message is required.";
    else if (message.length > 5000) fields.message = "Message must be 5,000 characters or fewer.";

    if (Object.keys(fields).length > 0) {
        return Response.json(
            { error: "Please fix the highlighted fields.", fields },
            { status: 400 }
        );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return Response.json(
            { error: "Email delivery isn't configured yet — RESEND_API_KEY is missing on the server." },
            { status: 503 }
        );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        // Resend test sender: delivers only to the Resend account owner's email until a custom domain is verified.
        from: "Learna Contact <onboarding@resend.dev>",
        to: RECIPIENT,
        replyTo: email,
        subject: `Learna contact — ${topic} — ${name}`,
        text: [
            "LEARNA — NEW CONTACT FORM MESSAGE",
            "=".repeat(40),
            `Name:   ${name}`,
            `Email:  ${email}`,
            `Topic:  ${topic}`,
            "",
            "Message:",
            message,
            "",
            "— Reply directly to this email to reach the sender.",
            "© 2026 Learna",
        ].join("\n"),
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
</head>
<body style="margin:0;padding:0;background-color:#F5F5F4;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">New message from ${escapeHtml(name)} — ${escapeHtml(topic)} on Learna</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F5F4;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #EBEBEB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                    <!-- Brand header -->
                    <tr>
                        <td style="background-color:#141414;padding:22px 28px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:26px;letter-spacing:3px;color:#FFFFFF;">
                                        Learna <span style="color:#B8860B;font-style:normal;">✦</span>
                                    </td>
                                    <td align="right" style="font-size:10px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.55);font-family:Helvetica,Arial,sans-serif;">
                                        Contact Form
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Gold accent strip -->
                    <tr>
                        <td style="height:4px;background-color:#B8860B;font-size:0;line-height:0;">&nbsp;</td>
                    </tr>
                    <!-- Intro -->
                    <tr>
                        <td style="padding:36px 28px 4px;">
                            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B8860B;font-weight:700;">New message</p>
                            <h1 style="margin:12px 0 0;font-size:22px;line-height:1.3;color:#141414;letter-spacing:0.5px;">You have a new contact submission</h1>
                            <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#5B5B5B;">Someone filled out the contact form on Learna. Here&rsquo;s everything they sent:</p>
                        </td>
                    </tr>
                    <!-- Details card -->
                    <tr>
                        <td style="padding:24px 28px 0;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAFAF8;border:1px solid #EBEBEB;border-radius:12px;">
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #EBEBEB;">
                                        <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A8A8A;">Name</p>
                                        <p style="margin:6px 0 0;font-size:15px;font-weight:600;color:#141414;">${escapeHtml(name)}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #EBEBEB;">
                                        <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A8A8A;">Email</p>
                                        <p style="margin:6px 0 0;font-size:15px;">
                                            <a href="mailto:${escapeHtml(email)}" style="color:#B8860B;text-decoration:underline;">${escapeHtml(email)}</a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 20px;">
                                        <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A8A8A;">Topic</p>
                                        <p style="margin:8px 0 0;">
                                            <span style="display:inline-block;background-color:#FDF1DD;color:#B8860B;border-radius:999px;padding:5px 16px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${escapeHtml(topic)}</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Message -->
                    <tr>
                        <td style="padding:24px 28px 0;">
                            <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A8A8A;">Message</p>
                            <div style="background-color:#FFFFFF;border:1px solid #EBEBEB;border-radius:12px;padding:18px 20px;font-size:14px;line-height:1.75;color:#141414;white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</div>
                        </td>
                    </tr>
                    <!-- Reply note -->
                    <tr>
                        <td style="padding:20px 28px 0;">
                            <p style="margin:0;font-size:13px;line-height:1.6;color:#5B5B5B;">
                                Reply directly to this email to respond &mdash; <strong style="color:#141414;">${escapeHtml(name)}</strong> is set as the reply-to recipient.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding:28px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="border-top:1px solid #EBEBEB;padding-top:18px;font-size:12px;letter-spacing:1px;color:#8A8A8A;">
                                        &copy; 2026 Learna &mdash; Quick recall for the hour before your interview.
                                    </td>
                                    <td align="right" style="border-top:1px solid #EBEBEB;padding-top:18px;font-size:14px;color:#B8860B;">
                                        &#10022;
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
    });

    if (error) {
        console.error("[contact] Resend send failed:", JSON.stringify(error));
        return Response.json(
            {
                error: "The email service rejected the message.",
                detail: error.message || error.name || "Unknown provider error",
            },
            { status: 502 }
        );
    }

    return Response.json({ ok: true });
}
