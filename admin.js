let RESPONSE_DATA=[];
const $=(s)=>document.querySelector(s);
const esc=(s="")=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

async function loadResponses(){
  const token=$("#token").value.trim();
  if(!token) return alert("Enter the admin token.");
  $("#loadBtn").disabled=true; $("#loadBtn").textContent="Loading…";
  try{
    const res=await fetch("/.netlify/functions/admin-responses",{headers:{Authorization:"Bearer "+token}});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||"Could not load responses");
    RESPONSE_DATA=data.responses||[];
    render();
  }catch(e){ alert(e.message); }
  finally{$("#loadBtn").disabled=false;$("#loadBtn").textContent="Load";}
}

function departmentList(r){
  const a=r.answers?.A_department_represented;
  return Array.isArray(a)&&a.length?a:[r.department_faculty||"Not specified"];
}
function formatDate(s){try{return new Date(s).toLocaleString()}catch{return s||""}}

function avgLms(){
  const sums={},counts={};
  RESPONSE_DATA.forEach(r=>{
    const d=r.answers?.D2||{};
    Object.entries(d).forEach(([k,v])=>{ if(Number(v)){sums[k]=(sums[k]||0)+Number(v);counts[k]=(counts[k]||0)+1;} });
  });
  return Object.keys(sums).map(k=>[k,sums[k]/counts[k],counts[k]]).sort((a,b)=>b[1]-a[1]);
}

function render(){
  const depts={};
  RESPONSE_DATA.forEach(r=>departmentList(r).forEach(d=>depts[d]=(depts[d]||0)+1));
  const deptRows=Object.entries(depts).sort((a,b)=>b[1]-a[1]);
  const lms=avgLms();
  const latest=RESPONSE_DATA.slice(0,50);

  $("#adminContent").innerHTML=`
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-secondary" id="csvBtn">Export CSV</button></div>
    <div class="metric-grid">
      <div class="metric"><div class="label">Responses</div><div class="value">${RESPONSE_DATA.length}</div></div>
      <div class="metric"><div class="label">Departments represented</div><div class="value">${deptRows.length}</div></div>
      <div class="metric"><div class="label">LMS ratings captured</div><div class="value">${lms.reduce((a,x)=>a+x[2],0)}</div></div>
      <div class="metric"><div class="label">Latest submission</div><div style="font-weight:750;margin-top:10px">${RESPONSE_DATA[0]?formatDate(RESPONSE_DATA[0].submitted_at):"—"}</div></div>
    </div>

    <div class="panel"><h3>Responses by department</h3>
      ${deptRows.length?deptRows.map(([d,n])=>`<div class="bar-row"><div>${esc(d)}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(5,n/Math.max(...deptRows.map(x=>x[1]))*100)}%"></div></div><strong>${n}</strong></div>`).join(""):"<p>No responses yet.</p>"}
    </div>

    <div class="panel"><h3>Highest-priority LMS requirements</h3>
      ${lms.length?lms.slice(0,12).map(([k,a,c])=>`<div class="bar-row"><div>${esc(k)}</div><div class="bar-track"><div class="bar-fill" style="width:${a/5*100}%"></div></div><strong>${a.toFixed(1)}</strong></div>`).join(""):"<p>LMS priority ratings have not yet been captured.</p>"}
    </div>

    <div class="panel"><h3>Submitted responses</h3>
      <div class="table-wrap"><table class="responses-table"><thead><tr><th>Reference</th><th>Respondent</th><th>Position</th><th>Department</th><th>Submitted</th></tr></thead>
      <tbody>${latest.map(r=>`<tr><td>${esc(r.submission_code)}</td><td>${esc(r.respondent_name)}</td><td>${esc(r.position)}</td><td>${departmentList(r).map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</td><td>${esc(formatDate(r.submitted_at))}</td></tr>`).join("")}</tbody></table></div>
    </div>`;
  $("#csvBtn").addEventListener("click",exportCsv);
}

function flatten(obj,prefix="",out={}){
  if(Array.isArray(obj)){ out[prefix]=obj.map(x=>typeof x==="object"?JSON.stringify(x):x).join(" | "); return out; }
  if(obj && typeof obj==="object"){
    Object.entries(obj).forEach(([k,v])=>flatten(v,prefix?prefix+"."+k:k,out));
    return out;
  }
  out[prefix]=obj??""; return out;
}
function csvCell(v){ return '"'+String(v??"").replace(/"/g,'""')+'"'; }
function exportCsv(){
  const rows=RESPONSE_DATA.map(r=>flatten(r));
  const headers=[...new Set(rows.flatMap(r=>Object.keys(r)))];
  const csv=[headers.map(csvCell).join(","),...rows.map(r=>headers.map(h=>csvCell(r[h])).join(","))].join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="coastal-needs-analysis-responses.csv";a.click();
}
$("#loadBtn").addEventListener("click",loadResponses);
$("#token").addEventListener("keydown",e=>{if(e.key==="Enter")loadResponses();});
