import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "node:crypto";

export default async (req) => {
  if (req.method !== "POST") return new Response(JSON.stringify({error:"Method not allowed"}), {status:405});
  try {
    const body = await req.json();
    if (body.website) return new Response(JSON.stringify({ok:true}), {status:200}); // honeypot
    const r = body.respondent || {};
    if (!r.name || !r.position || !r.email) {
      return new Response(JSON.stringify({error:"Name, position and email are required."}), {status:400});
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return new Response(JSON.stringify({error:"Survey storage is not configured."}), {status:500});

    const supabase = createClient(url, key, {auth:{persistSession:false}});
    const stamp = new Date().toISOString().slice(0,10).replaceAll("-","");
    const code = `EDB-COASTAL-${stamp}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const row = {
      submission_code: code,
      respondent_name: r.name,
      position: r.position,
      department_faculty: r.department_faculty || null,
      campus_office: r.campus_office || null,
      email: r.email,
      contact_number: r.contact_number || null,
      answers: body.answers || {},
      metadata: body.metadata || {}
    };

    const { error } = await supabase.from("coastal_needs_analysis_responses").insert(row);
    if (error) throw error;

    // Optional email acknowledgement / internal notification.
    if (process.env.RESEND_API_KEY && process.env.SURVEY_FROM_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const subject = "Coastal KZN TVET College Digital Needs Analysis — response received";
      await resend.emails.send({
        from: process.env.SURVEY_FROM_EMAIL,
        to: r.email,
        subject,
        html: `<p>Dear ${String(r.name).replace(/[<>]/g,"")},</p>
               <p>Thank you for completing the Coastal KZN TVET College Digital Learning & Digital Transformation Needs Analysis.</p>
               <p>Your response reference is <strong>${code}</strong>.</p>
               <p>Regards,<br>Edubyte<br><small>A Digital Learning Division of Lutsha Empowerment</small></p>`
      }).catch(()=>{});

      if (process.env.SURVEY_NOTIFY_EMAIL) {
        await resend.emails.send({
          from: process.env.SURVEY_FROM_EMAIL,
          to: process.env.SURVEY_NOTIFY_EMAIL,
          subject: `New Coastal needs-analysis response — ${code}`,
          html: `<p>A new response has been submitted by <strong>${String(r.name).replace(/[<>]/g,"")}</strong> (${String(r.position).replace(/[<>]/g,"")}).</p>
                 <p>Reference: <strong>${code}</strong></p>`
        }).catch(()=>{});
      }
    }

    return new Response(JSON.stringify({ok:true, submission_code:code}), {
      status:200, headers:{"Content-Type":"application/json"}
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({error:"The response could not be submitted. Please try again."}), {
      status:500, headers:{"Content-Type":"application/json"}
    });
  }
};
