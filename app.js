const state = {
  sectionIndex: 0,
  answers: JSON.parse(localStorage.getItem("edubyteCoastalSurvey") || "{}")
};

const $ = (s) => document.querySelector(s);
const esc = (s="") => String(s).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const keySafe = (s) => String(s).replace(/[^a-zA-Z0-9_-]/g,"_");

function toast(msg){
  const el=$("#toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(window._toastTimer); window._toastTimer=setTimeout(()=>el.classList.remove("show"),3000);
}

function saveLocal(){
  localStorage.setItem("edubyteCoastalSurvey", JSON.stringify(state.answers));
  $("#saveStatus").textContent = "Saved on this device · " + new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}

function buildSidebar(){
  $("#sidebar").innerHTML = SURVEY.sections.map((s,i)=>`
    <button type="button" class="section-link ${i===state.sectionIndex?"active":""}" data-index="${i}">
      <span class="num">${s.icon}</span><span>${esc(s.title)}</span>
    </button>`).join("");
  document.querySelectorAll(".section-link").forEach(b=>b.addEventListener("click",()=>{
    collectSection();
    goTo(Number(b.dataset.index));
  }));
}

function renderIntro(){
  $("#introCopy").innerHTML = SURVEY.intro.map(p=>`<p>${esc(p)}</p>`).join("");
}

function fieldValue(id){ return state.answers[id]; }

function renderQuestion(q){
  const value = fieldValue(q.id);
  const label = `<div class="question-label">${esc(q.label)}${q.required?' <span class="required">*</span>':''}</div>`;
  const help = q.help ? `<div class="help">${esc(q.help)}</div>` : "";
  if(["text","email","tel","date","number"].includes(q.type)){
    return `<div class="question" data-q="${q.id}">${label}${help}<input class="input" id="${q.id}" name="${q.id}" type="${q.type}" ${q.required?"required":""} value="${esc(value ?? "")}"></div>`;
  }
  if(q.type==="textarea"){
    return `<div class="question" data-q="${q.id}">${label}${help}<textarea class="textarea" id="${q.id}" name="${q.id}">${esc(value ?? "")}</textarea></div>`;
  }
  if(q.type==="radio"){
    const opts=q.options.map((o,i)=>`
      <label class="option"><input type="radio" name="${q.id}" value="${esc(o)}" ${(value===o)?"checked":""}><span>${esc(o)}</span></label>`).join("");
    return `<div class="question" data-q="${q.id}">${label}${help}<div class="options">${opts}</div></div>`;
  }
  if(q.type==="checkbox"){
    const arr=Array.isArray(value)?value:[];
    const opts=q.options.map(o=>`
      <label class="option"><input type="checkbox" name="${q.id}" value="${esc(o)}" ${arr.includes(o)?"checked":""}><span>${esc(o)}</span></label>`).join("");
    const other = q.other ? `<input class="input other-field" id="${q.id}__other" placeholder="Other — please specify" value="${esc(state.answers[q.id+"__other"] ?? "")}">` : "";
    return `<div class="question" data-q="${q.id}">${label}${help}<div class="options">${opts}</div>${other}</div>`;
  }
  if(q.type==="matrix"){
    const obj=(value && typeof value==="object")?value:{};
    const head=q.options.map(o=>`<th>${esc(o)}</th>`).join("");
    const rows=q.rows.map(r=>{
      const rid=keySafe(r);
      return `<tr><td>${esc(r)}</td>${q.options.map(o=>`<td><input type="radio" name="${q.id}__${rid}" data-row="${esc(r)}" value="${esc(o)}" ${obj[r]===o?"checked":""}></td>`).join("")}</tr>`;
    }).join("");
    return `<div class="question" data-q="${q.id}">${label}${help}<div class="table-wrap"><table class="matrix"><thead><tr><th>Area / Function</th>${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }
  if(q.type==="rating"){
    const obj=(value && typeof value==="object")?value:{};
    const head=[1,2,3,4,5].map(n=>`<th>${n}</th>`).join("");
    const rows=q.rows.map(r=>{
      const rid=keySafe(r);
      return `<tr><td>${esc(r)}</td>${[1,2,3,4,5].map(n=>`<td><input type="radio" name="${q.id}__${rid}" data-row="${esc(r)}" value="${n}" ${String(obj[r])===String(n)?"checked":""}></td>`).join("")}</tr>`;
    }).join("");
    return `<div class="question" data-q="${q.id}">${label}${help}<div class="table-wrap"><table class="matrix"><thead><tr><th>LMS Requirement</th>${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }
  if(q.type==="programmeTable"){
    const arr=Array.isArray(value)?value:Array.from({length:4},()=>({}));
    const rows=Array.from({length:4},(_,i)=>{
      const r=arr[i]||{};
      return `<tr>
        <td><input class="mini-input" data-pt="${i}" data-field="programme" value="${esc(r.programme||"")}"></td>
        <td><input class="mini-input" data-pt="${i}" data-field="campus" value="${esc(r.campus||"")}"></td>
        <td><input class="mini-input" data-pt="${i}" data-field="learners" type="number" min="0" value="${esc(r.learners||"")}"></td>
        <td><select class="mini-input" data-pt="${i}" data-field="priority">
          <option value=""></option>${["High","Medium","Low"].map(x=>`<option ${r.priority===x?"selected":""}>${x}</option>`).join("")}
        </select></td>
      </tr>`;
    }).join("");
    return `<div class="question" data-q="${q.id}">${label}<div class="table-wrap"><table class="matrix">
      <thead><tr><th>Programme</th><th>Campus/Faculty</th><th>Approx. Learners</th><th>Priority</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }
  return "";
}

function renderSection(){
  const s=SURVEY.sections[state.sectionIndex];
  $("#sectionHead").innerHTML=`<div class="eyebrow">Section ${s.id} · ${state.sectionIndex+1} of ${SURVEY.sections.length}</div><h2>${esc(s.title)}</h2>${s.description?`<p>${esc(s.description)}</p>`:""}`;
  $("#sectionBody").innerHTML=s.questions.map(renderQuestion).join("");
  $("#prevBtn").style.visibility=state.sectionIndex===0?"hidden":"visible";
  $("#nextBtn").textContent=state.sectionIndex===SURVEY.sections.length-1?"Submit response":"Next →";
  $("#progress").style.width=((state.sectionIndex+1)/SURVEY.sections.length*100)+"%";
  buildSidebar();
  window.scrollTo({top:0,behavior:"smooth"});
}

function collectSection(){
  const s=SURVEY.sections[state.sectionIndex];
  s.questions.forEach(q=>{
    if(["text","email","tel","date","number","textarea"].includes(q.type)){
      const el=document.getElementById(q.id);
      if(el) state.answers[q.id]=el.value.trim();
    } else if(q.type==="radio"){
      const el=document.querySelector(`input[name="${q.id}"]:checked`);
      state.answers[q.id]=el?el.value:"";
    } else if(q.type==="checkbox"){
      state.answers[q.id]=Array.from(document.querySelectorAll(`input[name="${q.id}"]:checked`)).map(x=>x.value);
      const other=document.getElementById(q.id+"__other");
      if(other) state.answers[q.id+"__other"]=other.value.trim();
    } else if(q.type==="matrix" || q.type==="rating"){
      const obj={};
      document.querySelectorAll(`[data-q="${q.id}"] input[type=radio]:checked`).forEach(el=>obj[el.dataset.row]=q.type==="rating"?Number(el.value):el.value);
      state.answers[q.id]=obj;
    } else if(q.type==="programmeTable"){
      const arr=Array.from({length:4},()=>({}));
      document.querySelectorAll(`[data-q="${q.id}"] [data-pt]`).forEach(el=>{
        arr[Number(el.dataset.pt)][el.dataset.field]=el.value;
      });
      state.answers[q.id]=arr;
    }
  });
  saveLocal();
}

function validateSection(){
  const s=SURVEY.sections[state.sectionIndex];
  const missing=[];
  s.questions.filter(q=>q.required).forEach(q=>{
    const el=document.getElementById(q.id);
    if(el && !el.value.trim()) missing.push(q.label);
  });
  if(missing.length){
    toast("Please complete the required fields before continuing.");
    const first=s.questions.find(q=>q.required && document.getElementById(q.id) && !document.getElementById(q.id).value.trim());
    if(first) document.getElementById(first.id).focus();
    return false;
  }
  if(state.sectionIndex===0){
    const email=document.getElementById("A_email");
    if(email && email.value && !email.checkValidity()){
      toast("Please enter a valid email address.");
      email.focus(); return false;
    }
  }
  return true;
}

function goTo(i){
  state.sectionIndex=Math.max(0,Math.min(SURVEY.sections.length-1,i));
  renderSection();
}

async function submitSurvey(){
  collectSection();
  const payload={
    respondent:{
      name:state.answers.A_name||"",
      position:state.answers.A_position||"",
      department_faculty:state.answers.A_department_faculty||"",
      campus_office:state.answers.A_campus_office||"",
      email:state.answers.A_email||"",
      contact_number:state.answers.A_contact||""
    },
    answers:state.answers,
    metadata:{survey:"Coastal KZN TVET College Digital Learning & Digital Transformation Needs Analysis",client_time:new Date().toISOString()},
    website:""
  };

  const btn=$("#nextBtn"); btn.disabled=true; btn.textContent="Submitting…";
  try{
    if(location.protocol==="file:"){
      const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
      const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="coastal-needs-analysis-preview-response.json"; a.click();
      showSuccess("PREVIEW-MODE");
      return;
    }
    const res=await fetch("/.netlify/functions/submit-survey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(data.error||"Submission failed");
    showSuccess(data.submission_code||"Submitted");
  }catch(err){
    console.error(err);
    toast("We could not submit the response. Your answers remain saved on this device.");
    btn.disabled=false; btn.textContent="Submit response";
  }
}

function showSuccess(code) {
  localStorage.removeItem("edubyteCoastalSurvey");

  // Switch the page into full-width confirmation mode
  document.querySelector(".layout").classList.add("success-mode");

  $("#surveyCard").innerHTML = `
    <div class="success">

      <div class="success-icon">✓</div>

      <div class="kicker">
        Response Received
      </div>

      <h2>Thank you for participating.</h2>

      <p class="success-message">
        Your contribution will support Coastal KZN TVET College's
        Digital Transformation Needs Analysis and proposed
        implementation roadmap.
      </p>

      <div class="success-email-note">
        A copy of your completed response has been sent to the
        email address you provided.
      </div>

      <div class="reference-box">
        <span class="reference-label">Submission Reference</span>
        <span class="code">${esc(code)}</span>
      </div>

      <div class="success-brand">
        <img src="/edubyte-logo.png" alt="Edubyte">
        <p>A Digital Learning Division of Lutsha Empowerment</p>
      </div>

    </div>
  `;

  $("#sidebar").style.display = "none";
  $("#progress").style.width = "100%";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

$("#prevBtn").addEventListener("click",()=>{ collectSection(); goTo(state.sectionIndex-1); });
$("#nextBtn").addEventListener("click",()=>{
  collectSection();
  if(!validateSection()) return;
  if(state.sectionIndex===SURVEY.sections.length-1) submitSurvey();
  else goTo(state.sectionIndex+1);
});

document.addEventListener("input",()=>{ clearTimeout(window._saveTimer); window._saveTimer=setTimeout(()=>{collectSection();},550); });

renderIntro();
renderSection();
