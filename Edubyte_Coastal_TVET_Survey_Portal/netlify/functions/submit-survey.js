import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "node:crypto";

/*
  Edubyte / Coastal KZN TVET College
  Survey submission function

  Required Netlify environment variables:
    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY

  Email variables:
    RESEND_API_KEY
    SURVEY_FROM_EMAIL
    SURVEY_NOTIFY_EMAIL

  Example SURVEY_FROM_EMAIL:
    Edubyte <survey@lutsha.org.za>
*/

const FIELD_LABELS = {
  A_name: "Name and Surname",
  A_position: "Position",
  A_department_faculty: "Department / Faculty",
  A_campus_office: "Campus / Office",
  A_email: "Email",
  A_contact: "Contact Number",
  A_date_completed: "Date Completed",
  A_department_represented: "Department represented",
  A_department_represented__other: "Other department represented",

  B1: "Approved digital learning / e-learning strategy",
  B1_reviewed: "When strategy was last reviewed",
  B2: "Main digital-learning priorities for 2027–2030",
  B2__other: "Other digital-learning priority",
  B3: "Approximate learners requiring LMS access",
  B4: "Preferred e-learning implementation approach",

  C1: "Current primary digital systems",
  C2: "Functions currently managed through ITS",
  C2__other: "Other ITS function",
  C3: "Challenges associated with move to ITS",
  C4: "Processes still operated outside ITS",
  C4__other: "Other process outside ITS",
  C4_explain: "Explanation of processes outside ITS",

  D1: "Current LMS status",
  D1_platform: "Current LMS platform",
  D1_active_users: "Approximate number of active LMS users",
  D2: "LMS requirement priority ratings",
  D3: "Campus administrative access with central oversight",
  D4: "Lecturer upload permissions",

  E1: "Current student portal status",
  E1_platform: "Student portal platform",
  E2: "Information learners can access through the portal",
  E2__other: "Other portal information",
  E3: "Preference for single sign-on",
  E4: "Automatic ITS-to-LMS population",
  E5: "Information ideally shared between systems",
  E5__other: "Other information to be shared",
  E6: "Availability of API / integration mechanism",
  E6_details: "ITS integration details",

  F1: "Programme categories requiring digital learning content",
  F1__other: "Other programme category",
  F2: "Priority programmes for digitisation",
  F3: "Most useful digital content formats",
  F3__other: "Other digital content format",
  F4: "Existing material suitable for conversion",
  F5: "Interest in College-owned content development programme",

  G1: "Official YouTube channel status",
  G2: "Current YouTube uses",
  G3: "Multimedia assistance required",

  H1: "Learner analytics indicators required",
  H2: "Dashboard / report recipients",
  H2__other: "Other dashboard / report recipient",

  I1: "Current electronic document management system",
  I2: "Current document storage methods",
  I3: "Document management challenges",
  I3__other: "Other document management challenge",

  J1: "Document governance and security requirements",

  K1: "Interest in supplementary short courses",
  K2: "Most valuable short-course areas",
  K2__other: "Other short-course area",
  K3: "Possible uses for short courses",

  L1: "Lecturer readiness for blended / e-learning delivery",
  L2: "Lecturer digital training required",

  M1: "Generative AI policy / guideline status",
  M2: "AI applications of interest",
  M2__other: "Other AI application",
  M3: "AI concerns to address",
  M3__other: "Other AI concern",

  N1: "Infrastructure readiness",
  N2: "Importance of offline / low-bandwidth access",

  O1: "Preferred support and management model",
  O2: "Functions required in a fully managed service"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isEmpty(value) {
  if (value === null || value === undefined || value === "") return true;

  if (Array.isArray(value)) {
    return value.every((item) => isEmpty(item));
  }

  if (typeof value === "object") {
    return (
      Object.keys(value).length === 0 ||
      Object.values(value).every((item) => isEmpty(item))
    );
  }

  return false;
}

function prettyKey(key) {
  return (
    FIELD_LABELS[key] ||
    String(key)
      .replace(/__/g, " - ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function valueToText(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => !isEmpty(item))
      .map((item) => {
        if (item && typeof item === "object") {
          return Object.entries(item)
            .filter(([, v]) => !isEmpty(v))
            .map(([k, v]) => `${k}: ${valueToText(v)}`)
            .join(", ");
        }

        return String(item);
      })
      .join("; ");
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => !isEmpty(v))
      .map(([k, v]) => `${k}: ${valueToText(v)}`)
      .join("; ");
  }

  return String(value ?? "");
}

function valueToHtml(value) {
  if (Array.isArray(value)) {
    const items = value.filter((item) => !isEmpty(item));

    if (!items.length) return "—";

    return items
      .map((item) => {
        if (item && typeof item === "object") {
          const parts = Object.entries(item)
            .filter(([, v]) => !isEmpty(v))
            .map(
              ([k, v]) =>
                `<strong>${escapeHtml(k)}:</strong> ${escapeHtml(
                  valueToText(v)
                )}`
            )
            .join(" &nbsp; | &nbsp; ");

          return `<div style="margin:0 0 6px">${parts}</div>`;
        }

        return `<div style="margin:0 0 4px">• ${escapeHtml(item)}</div>`;
      })
      .join("");
  }

  if (value && typeof value === "object") {
    const parts = Object.entries(value)
      .filter(([, v]) => !isEmpty(v))
      .map(
        ([k, v]) =>
          `<div style="margin:0 0 5px"><strong>${escapeHtml(
            k
          )}:</strong> ${escapeHtml(valueToText(v))}</div>`
      )
      .join("");

    return parts || "—";
  }

  return escapeHtml(value);
}

function buildFullResponseHtml(answers = {}) {
  const rows = Object.entries(answers)
    .filter(([, value]) => !isEmpty(value))
    .map(
      ([key, value]) => `
        <tr>
          <td style="width:38%;padding:10px 12px;border-bottom:1px solid #e5e7eb;vertical-align:top;font-weight:600;color:#1f2937">
            ${escapeHtml(prettyKey(key))}
          </td>

          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;vertical-align:top;color:#4b5563">
            ${valueToHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e5e7eb">
      ${
        rows ||
        '<tr><td style="padding:12px">No answers were captured.</td></tr>'
      }
    </table>
  `;
}

function buildFullResponseText(answers = {}) {
  return Object.entries(answers)
    .filter(([, value]) => !isEmpty(value))
    .map(([key, value]) => `${prettyKey(key)}\n${valueToText(value)}`)
    .join("\n\n");
}

function buildEmailHtml({
  title,
  introHtml,
  code,
  answers,
  footerText
}) {
  return `
  <!doctype html>
  <html>
    <body style="margin:0;background:#f4f7fa;font-family:Arial,Helvetica,sans-serif;color:#111827">

      <div style="max-width:780px;margin:0 auto;padding:24px 14px">

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">

          <div style="background:#0789cf;color:#ffffff;padding:22px 26px">

            <div style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">
              Edubyte
            </div>

            <h1 style="font-size:23px;line-height:1.3;margin:8px 0 0">
              ${escapeHtml(title)}
            </h1>

          </div>

          <div style="padding:24px 26px">

            <div style="font-size:15px;line-height:1.6;color:#374151">
              ${introHtml}
            </div>

            <p style="font-size:14px;margin:20px 0">
              <strong>Submission reference:</strong>
              ${escapeHtml(code)}
            </p>

            ${buildFullResponseHtml(answers)}

            <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#6b7280">
              ${escapeHtml(footerText)}
            </p>

          </div>
        </div>

        <div style="text-align:center;margin-top:14px;font-size:12px;color:#7b8794">
          Edubyte · A Digital Learning Division of Lutsha Empowerment
        </div>

      </div>

    </body>
  </html>
  `;
}

async function sendEmailSafely(resend, payload, label) {
  try {
    const result = await resend.emails.send(payload);

    if (result?.error) {
      console.error(`${label} failed:`, result.error);

      return {
        status: "failed",
        error:
          result.error.message ||
          "Resend returned an error"
      };
    }

    return {
      status: "sent",
      id: result?.data?.id || null
    };

  } catch (error) {
    console.error(`${label} failed:`, error);

    return {
      status: "failed",
      error:
        error?.message ||
        "Unknown email error"
    };
  }
}

export default async (req) => {

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "Method not allowed"
      },
      405
    );
  }

  try {

    const body = await req.json();

    /*
      Simple honeypot.
      Real respondents should never populate this field.
    */
    if (body.website) {
      return jsonResponse({
        ok: true
      });
    }

    const respondent =
      body.respondent || {};

    const answers =
      body.answers || {};

    if (
      !respondent.name ||
      !respondent.position ||
      !respondent.email
    ) {
      return jsonResponse(
        {
          error:
            "Name, position and email are required."
        },
        400
      );
    }

    /*
      SUPABASE
    */

    const supabaseUrl =
      process.env.SUPABASE_URL;

    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseKey
    ) {
      console.error(
        "Missing Supabase environment variables."
      );

      return jsonResponse(
        {
          error:
            "Survey storage is not configured."
        },
        500
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        supabaseKey,
        {
          auth: {
            persistSession: false
          }
        }
      );

    const datePart =
      new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    const randomPart =
      crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    const submissionCode =
      `EDB-COASTAL-${datePart}-${randomPart}`;

    const databaseRow = {
      submission_code:
        submissionCode,

      respondent_name:
        respondent.name,

      position:
        respondent.position,

      department_faculty:
        respondent.department_faculty ||
        null,

      campus_office:
        respondent.campus_office ||
        null,

      email:
        respondent.email,

      contact_number:
        respondent.contact_number ||
        null,

      answers,

      metadata:
        body.metadata || {}
    };

    const {
      error: insertError
    } =
      await supabase
        .from(
          "coastal_needs_analysis_responses"
        )
        .insert(databaseRow);

    if (insertError) {

      console.error(
        "Supabase insert failed:",
        insertError
      );

      return jsonResponse(
        {
          error:
            "The response could not be saved."
        },
        500
      );
    }

    /*
      IMPORTANT

      At this point the response is safely stored
      in Supabase.

      Email failures must NOT cause the survey
      submission itself to fail.
    */

    const emailStatus = {
      respondent:
        "not_configured",

      edubyte:
        "not_configured"
    };

    /*
      RESEND
    */

    const resendKey =
      process.env.RESEND_API_KEY;

    const fromEmail =
      process.env.SURVEY_FROM_EMAIL;

    const notifyEmail =
      process.env.SURVEY_NOTIFY_EMAIL;

    if (
      resendKey &&
      fromEmail
    ) {

      const resend =
        new Resend(resendKey);

      const responseText =
        buildFullResponseText(
          answers
        );

      /*
        EMAIL 1
        Copy to respondent
      */

      const respondentHtml =
        buildEmailHtml({

          title:
            "Your Coastal KZN TVET College Needs Analysis Response",

          introHtml:
            `Dear ${escapeHtml(
              respondent.name
            )},<br><br>
            Thank you for completing the Coastal KZN TVET College Digital Learning &amp; Digital Transformation Needs Analysis.
            Below is a copy of the response you submitted.`,

          code:
            submissionCode,

          answers,

          footerText:
            "Please retain this email for your records. Your response will contribute to the consolidated institutional needs analysis."
        });

      const respondentText =
`Dear ${respondent.name},

Thank you for completing the Coastal KZN TVET College Digital Learning & Digital Transformation Needs Analysis.

Submission reference:
${submissionCode}

COPY OF YOUR SUBMISSION

${responseText}

Regards

Edubyte
A Digital Learning Division of Lutsha Empowerment`;

      const respondentResult =
        await sendEmailSafely(
          resend,
          {
            from:
              fromEmail,

            to:
              respondent.email,

            subject:
              `Copy of your Coastal Digital Needs Analysis response — ${submissionCode}`,

            html:
              respondentHtml,

            text:
              respondentText
          },
          "Respondent email"
        );

      emailStatus.respondent =
        respondentResult.status;

      /*
        EMAIL 2
        Full response to Edubyte
      */

      if (notifyEmail) {

        const edubyteHtml =
          buildEmailHtml({

            title:
              "New Coastal KZN TVET College Needs Analysis Response",

            introHtml:
              `A new needs-analysis response has been submitted.<br><br>

              <strong>Respondent:</strong>
              ${escapeHtml(
                respondent.name
              )}<br>

              <strong>Position:</strong>
              ${escapeHtml(
                respondent.position
              )}<br>

              <strong>Department / Faculty:</strong>
              ${escapeHtml(
                respondent.department_faculty ||
                "Not specified"
              )}<br>

              <strong>Campus / Office:</strong>
              ${escapeHtml(
                respondent.campus_office ||
                "Not specified"
              )}<br>

              <strong>Email:</strong>
              ${escapeHtml(
                respondent.email
              )}`,

            code:
              submissionCode,

            answers,

            footerText:
              "This notification was generated automatically by the Edubyte Coastal KZN TVET College Needs Analysis Portal."
          });

        const edubyteText =
`NEW COASTAL KZN TVET COLLEGE NEEDS ANALYSIS RESPONSE

Submission reference:
${submissionCode}

Respondent:
${respondent.name}

Position:
${respondent.position}

Department / Faculty:
${respondent.department_faculty || "Not specified"}

Campus / Office:
${respondent.campus_office || "Not specified"}

Email:
${respondent.email}

FULL RESPONSE

${responseText}`;

        const edubyteResult =
          await sendEmailSafely(
            resend,
            {
              from:
                fromEmail,

              to:
                notifyEmail,

              subject:
                `New Coastal needs-analysis response — ${respondent.name} — ${submissionCode}`,

              html:
                edubyteHtml,

              text:
                edubyteText
            },
            "Edubyte notification email"
          );

        emailStatus.edubyte =
          edubyteResult.status;
      }

    } else {

      console.warn(
        "Email not configured. RESEND_API_KEY and/or SURVEY_FROM_EMAIL is missing."
      );
    }

    /*
      SUCCESS
    */

    return jsonResponse({
      ok: true,

      submission_code:
        submissionCode,

      email_status:
        emailStatus
    });

  } catch (error) {

    console.error(
      "submit-survey function error:",
      error
    );

    return jsonResponse(
      {
        error:
          "The response could not be submitted. Please try again."
      },
      500
    );
  }
};
