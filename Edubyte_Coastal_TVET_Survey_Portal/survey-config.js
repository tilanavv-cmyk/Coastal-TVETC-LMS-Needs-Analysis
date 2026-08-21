const SURVEY = {
  title: "Coastal KZN TVET College",
  subtitle: "Digital Learning & Digital Transformation Needs Analysis",
  preparedBy: "Edubyte — A Digital Learning Division of Lutsha Empowerment",
  intro: [
    "This questionnaire is intended to assist Coastal KZN TVET College and Edubyte in assessing the College’s current digital learning environment, institutional systems, e-learning readiness, digital content requirements and opportunities for greater integration between academic, student administration and support systems.",
    "The information gathered will be used to prepare a proposed Digital Learning Roadmap and Implementation Solution for the College.",
    "This assessment does not commit Coastal KZN TVET College to procure any service."
  ],
  sections: [
    {
      id:"A", title:"Respondent Information", icon:"01",
      description:"Please tell us who is completing this response.",
      questions:[
        {id:"A_name", type:"text", label:"Name and Surname", required:true},
        {id:"A_position", type:"text", label:"Position", required:true},
        {id:"A_department_faculty", type:"text", label:"Department / Faculty"},
        {id:"A_campus_office", type:"text", label:"Campus / Office"},
        {id:"A_email", type:"email", label:"Email", required:true},
        {id:"A_contact", type:"tel", label:"Contact Number"},
        {id:"A_date_completed", type:"date", label:"Date Completed"},
        {id:"A_department_represented", type:"checkbox", label:"Department represented", options:[
          "Curriculum and Academic Services","Research","ICT","Student Administration / Registrar",
          "Finance","Supply Chain Management","Asset Management","Marketing / Communications",
          "Student Support Services","Examination","Campus Management","Senior Management","Other"
        ], other:true}
      ]
    },
    {
      id:"B", title:"College Digital Learning Strategy", icon:"02",
      questions:[
        {id:"B1", type:"radio", label:"B1. Does the College currently have an approved digital learning or e-learning strategy?", options:["Yes","No","In development","Unsure"]},
        {id:"B1_reviewed", type:"text", label:"If yes, when was it last reviewed?"},
        {id:"B2", type:"checkbox", label:"B2. What are the College’s main digital-learning priorities for 2027–2030? Select all that apply.", options:[
          "Establishing or improving an LMS","Digitising learning material","Increasing blended learning for full time and part time learners",
          "Offering fully online programmes","Improving learner access to resources","Improving learner engagement",
          "Lecturer digital-skills development","Learner progress tracking","Digital assessments","Student portal development",
          "Integration between institutional systems","AI-supported learning","Mobile learning","Improving access for rural learners",
          "Generating additional income","Reducing printing and paper-based learning","Other"
        ], other:true},
        {id:"B3", type:"radio", label:"B3. Approximately how many learners would potentially require access to an LMS?", options:[
          "Fewer than 1,000","1,000–3,000","3,001–5,000","5,001–10,000","More than 10,000","To be confirmed"
        ]},
        {id:"B4", type:"radio", label:"B4. Would the College prefer to implement e-learning:", options:[
          "Across the entire institution","Per faculty","Per programme","Per campus","Through an initial pilot","Undecided"
        ]}
      ]
    },
    {
      id:"C", title:"Current Systems Environment", icon:"03",
      questions:[
        {id:"C1", type:"matrix", label:"C1. Please identify if any of the following Functions/Departments have primary digital systems currently used by the College.", rows:[
          "Student Administration","Finance (archiving and storage)","Registration portal",
          "Examination (results and secure distribution of question papers)","LMS / E-Learning","Asset Management",
          "SCM / Procurement","Executive and Council (document management, minute recording, archiving, track of resolutions, tracking of performance irt college strategic plan)",
          "Website / Student Portal"
        ], options:["Yes","No"]},
        {id:"C2", type:"checkbox", label:"C2. Coastal has transitioned from Coltech to ITS. Which functions are currently being managed through ITS?", options:[
          "Applications","Student registration","Student records","Academic records","Examination results","Financial accounts",
          "Fees","Student statements","Programme information","Timetables","Other"
        ], other:true},
        {id:"C3", type:"textarea", label:"C3. Are there any current challenges associated with the move to ITS?"},
        {id:"C4", type:"checkbox", label:"C4. Are there processes that are still being operated outside ITS using:", options:[
          "Excel spreadsheets","Emails","Paper forms","Shared network folders","Google Drive / OneDrive","Standalone software","Other"
        ], other:true},
        {id:"C4_explain", type:"textarea", label:"Please explain:"}
      ]
    },
    {
      id:"D", title:"Learning Management System Requirements", icon:"04",
      questions:[
        {id:"D1", type:"radio", label:"D1. Does Coastal currently operate an LMS?", options:["Yes","No","Limited implementation","Pilot only","Unsure"]},
        {id:"D1_platform", type:"text", label:"If yes — Platform"},
        {id:"D1_active_users", type:"number", label:"Approximate number of active users"},
        {id:"D2", type:"rating", label:"D2. Which LMS functions are required?", help:"1 = Not Required · 2 = Low Priority · 3 = Useful · 4 = Important · 5 = Critical", rows:[
          "Learner registration","Automatic learner enrolment","Course catalogue","Interactive lessons","Video learning",
          "Online quizzes","Assignments","Lecturer marking","Discussion forums","Attendance tracking",
          "Learner progress tracking","Automated notifications","SMS / email communication","Digital certificates",
          "Lecturer dashboards","Management dashboards","Learner-at-risk reporting","Mobile access",
          "Offline learning capability","AI-supported learner assistance","Multi-campus administration","Examination preparation"
        ]},
        {id:"D3", type:"radio", label:"D3. Should each campus have its own administrative access while the College retains central oversight?", options:["Yes","No","To be explored"]},
        {id:"D4", type:"checkbox", label:"D4. Should lecturers be able to upload their own:", options:[
          "Notes","Videos","Assessments","Assignments","Announcements","Supplementary resources","All of the above"
        ]}
      ]
    },
    {
      id:"E", title:"Student Portal and ITS Integration", icon:"05",
      questions:[
        {id:"E1", type:"radio", label:"E1. Does the College currently provide learners with a student portal?", options:["Yes","No","In development"]},
        {id:"E1_platform", type:"text", label:"If yes, please provide the system/platform name:"},
        {id:"E2", type:"checkbox", label:"E2. What information can learners currently access through the portal?", options:[
          "Application status","Registration status","Programme details","Subjects/modules","Student account","Outstanding fees",
          "Statements","Examination timetable","Examination results","Academic history","Proof of registration","College notices","Learning material","Other"
        ], other:true},
        {id:"E3", type:"radio", label:"E3. Would Coastal prefer learners to access the student portal and LMS through a single sign-on/login, where technically feasible?", options:["Yes","No","Would like this investigated"]},
        {id:"E4", type:"radio", label:"E4. Would it be useful for selected student information from ITS to populate the LMS automatically?", help:"Example: Student record → Registration → Programme → Subjects → LMS enrolment", options:["Yes","No","To be investigated"]},
        {id:"E5", type:"checkbox", label:"E5. Which information would ideally be shared between systems?", options:[
          "Student number","Name and surname","Campus","Programme","Subjects/modules","Registration status","Academic year",
          "Email/contact information","Results","Account status","Other"
        ], other:true},
        {id:"E6", type:"radio", label:"E6. Does Coastal currently have access to an API, integration layer, data export or other approved mechanism through which ITS can exchange information with third-party systems?", options:["Yes","No","Unsure","Requires confirmation from ICT / ITS"]},
        {id:"E6_details", type:"textarea", label:"Please provide details where known:"}
      ]
    },
    {
      id:"F", title:"Digital Content Needs", icon:"06",
      questions:[
        {id:"F1", type:"checkbox", label:"F1. For which programme categories does Coastal require digital learning content?", options:[
          "Report 191 / NATED","NCV","Occupational Qualifications","Skills Programmes","Short Courses","Staff Development","Other"
        ], other:true},
        {id:"F2", type:"programmeTable", label:"F2. Please identify priority programmes for digitisation."},
        {id:"F3", type:"checkbox", label:"F3. What content formats would be most useful?", options:[
          "Interactive lessons","Micro-learning modules","Short videos","Lecturer-recorded lessons","Animated explanations",
          "Interactive quizzes","Games","Practical demonstrations","Simulations","Audio lessons","Digital workbooks",
          "Past examination preparation","Assessment banks","Other"
        ], other:true},
        {id:"F4", type:"radio", label:"F4. Does the College currently have learning material that could be converted into interactive format?", options:[
          "Yes – extensively","Yes – for selected programmes","Very little","No","Requires an audit"
        ]},
        {id:"F5", type:"radio", label:"F5. Would Coastal be interested in establishing an institutional digital content development programme, where lecturers work with Edubyte to create College-owned learning resources?", options:["Yes","No","Possibly"]}
      ]
    },
    {
      id:"G", title:"Video, YouTube and Multimedia", icon:"07",
      questions:[
        {id:"G1", type:"radio", label:"G1. Does Coastal currently operate an official YouTube channel?", options:["Yes","No","Unsure"]},
        {id:"G2", type:"checkbox", label:"G2. Is YouTube currently being used for:", options:[
          "Teaching","Lecturer videos","Practical demonstrations","Career guidance","College marketing","Events","Student orientation","Not currently used strategically"
        ]},
        {id:"G3", type:"checkbox", label:"G3. Would the College require assistance with:", options:[
          "Video recording","Video editing","Animation","Lecturer studio sessions","YouTube channel management","Content scheduling",
          "Closed captions","Translation","Interactive video integration into LMS courses"
        ]}
      ]
    },
    {
      id:"H", title:"Learner Analytics and Reporting", icon:"08",
      questions:[
        {id:"H1", type:"checkbox", label:"H1. Which indicators should management be able to monitor?", options:[
          "LMS login frequency","Course participation","Course completion","Assessment performance","Assignment submission","Attendance",
          "Learners falling behind","Learners who have stopped engaging","Performance by campus","Performance by programme",
          "Performance by lecturer","Examination readiness"
        ]},
        {id:"H2", type:"checkbox", label:"H2. Who should receive dashboards/reports?", options:[
          "Principal","Deputy Principals","Curriculum Heads","Campus Managers","HoDs","Lecturers","Student Support","Research Department","Other"
        ], other:true}
      ]
    },
    {
      id:"I", title:"Electronic Document Management System", icon:"09",
      description:"This section assesses whether the College would benefit from an Electronic Document and Workflow Management System (EDMS) for administrative departments.",
      questions:[
        {id:"I1", type:"radio", label:"I1. Does the College currently have a formal electronic document management system?", options:["Yes","No","Partially","Department dependent","Unsure"]},
        {id:"I2", type:"checkbox", label:"I2. How are documents mainly stored?", options:[
          "Paper files","Local computers","Shared network drives","Email","OneDrive / SharePoint","Google Drive","Existing EDMS","Combination of systems"
        ]},
        {id:"I3", type:"checkbox", label:"I3. Which challenges are experienced?", options:[
          "Difficulty finding documents","Duplicate documents","Missing files","Version-control problems","Paper-heavy processes","Slow approvals",
          "Limited audit trail","Difficulty accessing historic records","Documents stored in employee emails",
          "No consistent naming/indexing system","Limited document security","Difficulty preparing for audits","Other"
        ], other:true}
      ]
    },
    {
      id:"J", title:"Document Governance and Security", icon:"10",
      questions:[
        {id:"J1", type:"checkbox", label:"J1. Would the College require the following?", options:[
          "Role-based document access","Electronic approval workflows","Digital signatures","Version control","Audit trail",
          "Search by keyword/reference","Document retention rules","Automated archiving","Secure backup",
          "POPIA-aligned access controls","Records disposal controls","Management dashboards"
        ]}
      ]
    },
    {
      id:"K", title:"Short Courses and Student Exit Strategy", icon:"11",
      description:"Edubyte has a library of short, non-accredited courses that can supplement formal programmes and support student employability.",
      questions:[
        {id:"K1", type:"radio", label:"K1. Would Coastal be interested in providing supplementary short courses to students?", options:["Yes","No","Possibly"]},
        {id:"K2", type:"checkbox", label:"K2. Which areas would be most valuable?", options:[
          "Workplace readiness","Entrepreneurship","Digital literacy","Microsoft Office","Customer service","Project management",
          "Financial literacy","Business communication","CV and interview preparation","Supervisory skills","Social media skills","Events management","Other"
        ], other:true},
        {id:"K3", type:"checkbox", label:"K3. Could short courses form part of:", options:[
          "Student orientation","Final-year exit programmes","Work-integrated learning preparation","Entrepreneurship programmes",
          "Staff development","Alumni support","Community outreach"
        ]}
      ]
    },
    {
      id:"L", title:"Staff Digital Capacity", icon:"12",
      questions:[
        {id:"L1", type:"radio", label:"L1. How would you rate lecturer readiness for blended/e-learning delivery?", options:[
          "Very strong","Strong","Moderate","Limited","Requires substantial development"
        ]},
        {id:"L2", type:"checkbox", label:"L2. Which training would lecturers require?", options:[
          "LMS navigation","Uploading resources","Online assessment","Creating digital learning content","Recording educational videos",
          "Micro-learning","AI in teaching and learning","Learner analytics","Online facilitation","Digital assessment integrity"
        ]}
      ]
    },
    {
      id:"M", title:"AI Readiness", icon:"13",
      questions:[
        {id:"M1", type:"radio", label:"M1. Does the College currently have a policy or guideline on the use of generative AI?", options:["Yes","No","In development","Unsure"]},
        {id:"M2", type:"checkbox", label:"M2. Which AI applications would the College be interested in exploring?", options:[
          "AI learner assistant","Lecturer content-development support","Question paper generation","Automated formative feedback",
          "Translation","Accessibility support","Learner-at-risk identification","Student enquiry chatbot","Administrative automation",
          "Document search functions (archiving and retrieval)","Marketing content support","Document search","Other"
        ], other:true},
        {id:"M3", type:"checkbox", label:"M3. What concerns would need to be addressed before introducing AI?", options:[
          "Data privacy","Academic integrity","Accuracy","Staff readiness","Learner misuse","Infrastructure","Policy","Cost","Other"
        ], other:true}
      ]
    },
    {
      id:"N", title:"Infrastructure and Connectivity", icon:"14",
      questions:[
        {id:"N1", type:"matrix", label:"N1. Are College campuses sufficiently equipped for expanded digital learning?", rows:[
          "Internet bandwidth","Wi-Fi","Computer laboratories","Learner devices","Lecturer devices","Server/cloud infrastructure","Technical support"
        ], options:["Adequate","Needs Improvement","Unsure"]},
        {id:"N2", type:"radio", label:"N2. Is offline or low-bandwidth access important?", options:["Critical","Important","Useful","Not required"]}
      ]
    },
    {
      id:"O", title:"Support and Management Model", icon:"15",
      questions:[
        {id:"O1", type:"radio", label:"O1. Which model would Coastal prefer?", options:[
          "College manages the LMS internally","Edubyte hosts while Coastal manages users","Shared-management model","Fully managed service","To be determined after pilot"
        ]},
        {id:"O2", type:"checkbox", label:"O2. If Edubyte provided a fully managed service, which functions should be included?", options:[
          "Registrations","User account creation","Programme enrolment","Technical helpdesk","Lecturer support","Learner support",
          "Progress reporting","Analytics","Content updates","Examination preparation","Management reporting"
        ]}
      ]
    }
  ]
};
