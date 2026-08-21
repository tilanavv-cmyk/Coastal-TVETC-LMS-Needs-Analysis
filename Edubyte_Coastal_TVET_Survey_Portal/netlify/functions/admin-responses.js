import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

function safeEqual(a,b){
  const aa=Buffer.from(String(a||"")); const bb=Buffer.from(String(b||""));
  return aa.length===bb.length && crypto.timingSafeEqual(aa,bb);
}
export default async (req) => {
  if (req.method !== "GET") return new Response(JSON.stringify({error:"Method not allowed"}), {status:405});
  const token=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");
  if (!process.env.ADMIN_TOKEN || !safeEqual(token, process.env.ADMIN_TOKEN)) {
    return new Response(JSON.stringify({error:"Unauthorized"}), {status:401,headers:{"Content-Type":"application/json"}});
  }
  try{
    const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
    const {data,error}=await supabase.from("coastal_needs_analysis_responses").select("*").order("submitted_at",{ascending:false}).limit(500);
    if(error) throw error;
    return new Response(JSON.stringify({responses:data||[]}),{status:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
  }catch(e){
    console.error(e);
    return new Response(JSON.stringify({error:"Could not load responses"}),{status:500,headers:{"Content-Type":"application/json"}});
  }
};
