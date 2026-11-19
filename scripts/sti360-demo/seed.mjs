// Sample data for the offline STI-360 demo. Every person here is made up; schools are
// public institution names. Deterministic (seeded random), so rebuilds give the same data.
import { readFileSync } from "node:fs";

export const DEMO = {
  admin:   { id: "00000000-0000-4000-a000-000000000001", email: "academic.head@sti360.demo", first: "Teresa", last: "Villanueva" },
  student: { id: "00000000-0000-4000-a000-000000000002", email: "bianca.reyes@sti360.demo", first: "Bianca", last: "Reyes" },
  superuser: { id: "00000000-0000-4000-a000-000000000003", email: "registrar.su@sti360.demo", first: "Ramon", last: "Aquino" },
};

const ACTIVE = { sy: "2026-2027", sem: "1st Semester" };
const TERMS = [
  ["2024-2025", "1st Semester"], ["2024-2025", "2nd Semester"],
  ["2025-2026", "1st Semester"], ["2025-2026", "2nd Semester"],
  ["2026-2027", "1st Semester"],
];

let seed = 360360;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const chance = (p) => rnd() < p;
const round2 = (n) => Math.round(n * 100) / 100;
let uuidN = 1;
const uuid = () => `5eed0000-0000-4000-8000-${String(uuidN++).padStart(12, "0")}`;
const daysAgo = (d, h = 9) => { const x = new Date(Date.UTC(2026, 10, 18, h)); x.setUTCDate(x.getUTCDate() - d); return x.toISOString(); };
const dateOnly = (iso) => iso.slice(0, 10);

const FIRST = ["Andrea", "Miguel", "Sofia", "Joshua", "Patricia", "Carlo", "Nicole", "Paolo", "Kimberly", "Mark", "Angelica", "John Paul", "Jasmine", "Christian", "Camille", "Renz", "Princess", "Kenneth", "Erika", "Jerome", "Danica", "Bryan", "Trisha", "Vincent", "Shaira", "Aldrin", "Mae", "Luis", "Hannah", "Rafael", "Bea", "Gabriel", "Czarina", "Ivan", "Rhea", "Marco", "Joanna", "Jericho", "Kyla", "Lance", "Ysabel", "Ralph", "Clarisse", "Nathaniel", "Leah", "Adrian", "Pia", "Emmanuel", "Joyce", "Dominic"];
const LAST = ["Santos", "Reyes", "Cruz", "Bautista", "Ocampo", "Garcia", "Mendoza", "Torres", "Tomas", "Andrada", "Castillo", "Flores", "Villanueva", "Ramos", "Castro", "Rivera", "Aquino", "Navarro", "Salazar", "Mercado", "Domingo", "Gutierrez", "Pascual", "Soriano", "Manalo", "Dizon", "Lim", "Tan", "Del Rosario", "Valdez", "De Leon", "Fernandez", "Marquez", "Panganiban", "Lacson", "Robles", "Samonte", "Esguerra", "Gonzales", "Natividad"];

const SCHOOLS = [
  // name, type, city, lat, lng, offers_college
  ["STI College Alabang", "competition", "Muntinlupa", 14.4231, 121.0409, true],
  ["Muntinlupa National High School", "feeder", "Muntinlupa", 14.3937, 121.0472, false],
  ["Muntinlupa Science High School", "feeder", "Muntinlupa", 14.4110, 121.0430, false],
  ["Pedro E. Diaz High School", "feeder", "Muntinlupa", 14.4290, 121.0360, false],
  ["Muntinlupa Business High School", "feeder", "Muntinlupa", 14.3820, 121.0480, false],
  ["Tunasan National High School", "feeder", "Muntinlupa", 14.3700, 121.0440, false],
  ["Parañaque National High School", "feeder", "Parañaque", 14.4793, 121.0198, false],
  ["Doña Josefa Bautista High School", "non-feeder", "Parañaque", 14.4650, 121.0050, false],
  ["San Pedro Relocation Center National High School", "feeder", "San Pedro", 14.3510, 121.0420, false],
  ["Pacita Complex National High School", "non-feeder", "San Pedro", 14.3460, 121.0560, false],
  ["Las Piñas City National Senior High School", "non-feeder", "Las Piñas", 14.4450, 120.9930, false],
  ["Colegio de Muntinlupa", "competition", "Muntinlupa", 14.3900, 121.0460, true],
  ["Pamantasan ng Lungsod ng Muntinlupa", "competition", "Muntinlupa", 14.3880, 121.0480, true],
  ["AMA Computer College Parañaque", "competition", "Parañaque", 14.4800, 121.0190, true],
];

const CURRICULUM = {
  BSIT: {
    "1st Year": { "1st Semester": [["CITE1001", "Introduction to Computing", 3], ["CITE1002", "Computer Programming 1", 3], ["GE1001", "Understanding the Self", 3], ["GE1002", "Mathematics in the Modern World", 3], ["GE1003", "Purposive Communication", 3], ["PE1001", "Physical Education 1", 2], ["NSTP1001", "National Service Training Program 1", 3]],
                  "2nd Semester": [["CITE1003", "Computer Programming 2", 3, "CITE1002"], ["CITE1004", "Discrete Mathematics", 3, "GE1002"], ["ITE1001", "Introduction to Human Computer Interaction", 3], ["GE1004", "Readings in Philippine History", 3], ["GE1005", "Science, Technology and Society", 3], ["PE1002", "Physical Education 2", 2, "PE1001"], ["NSTP1002", "National Service Training Program 2", 3, "NSTP1001"]] },
    "2nd Year": { "1st Semester": [["CITE2001", "Data Structures and Algorithms", 3, "CITE1003"], ["ITE2001", "Object-Oriented Programming", 3, "CITE1003"], ["ITE2002", "Platform Technologies", 3], ["ITE2003", "Networking 1", 3], ["GE2001", "The Contemporary World", 3], ["PE2001", "Physical Education 3", 2, "PE1002"]],
                  "2nd Semester": [["CITE2002", "Information Management", 3, "CITE2001"], ["ITE2004", "Networking 2", 3, "ITE2003"], ["ITE2005", "Web Systems and Technologies", 3, "ITE2001"], ["ITE2006", "Quantitative Methods", 3, "CITE1004"], ["GE2002", "Ethics", 3], ["PE2002", "Physical Education 4", 2, "PE2001"]] },
    "3rd Year": { "1st Semester": [["ITE3001", "Integrative Programming and Technologies", 3, "ITE2005"], ["ITE3002", "Systems Integration and Architecture", 3], ["ITE3003", "Advanced Database Systems", 3, "CITE2002"], ["ITE3004", "Mobile Application Development", 3, "ITE2001"], ["GE3001", "Art Appreciation", 3]],
                  "2nd Semester": [["ITE3005", "Information Assurance and Security 1", 3], ["ITE3006", "Application Development and Emerging Technologies", 3, "ITE3001"], ["ITE3007", "Capstone Project and Research 1", 3], ["ITE3008", "Social and Professional Issues", 3], ["GE3002", "Life and Works of Rizal", 3]] },
    "4th Year": { "1st Semester": [["ITE4001", "Capstone Project and Research 2", 3, "ITE3007"], ["ITE4002", "Information Assurance and Security 2", 3, "ITE3005"], ["ITE4003", "Systems Administration and Maintenance", 3], ["ITE4004", "IT Service Management", 3]],
                  "2nd Semester": [["ITE4005", "Practicum (486 hours)", 6, "ITE4001"]] },
  },
  BSBA: {
    "1st Year": { "1st Semester": [["BA1001", "Basic Microeconomics", 3], ["BA1002", "Fundamentals of Accounting", 3], ["GE1001", "Understanding the Self", 3], ["GE1002", "Mathematics in the Modern World", 3]],
                  "2nd Semester": [["BA1003", "Business Law and Taxation", 3], ["BA1004", "Principles of Management", 3], ["GE1003", "Purposive Communication", 3]] },
    "2nd Year": { "1st Semester": [["BA2001", "Marketing Management", 3], ["BA2002", "Human Resource Management", 3]], "2nd Semester": [["BA2003", "Operations Management", 3, "BA1004"], ["BA2004", "Financial Management", 3, "BA1002"]] },
    "3rd Year": { "1st Semester": [["BA3001", "Strategic Management", 3]], "2nd Semester": [["BA3002", "Business Research", 3]] },
    "4th Year": { "1st Semester": [["BA4001", "Feasibility Study", 3, "BA3002"]], "2nd Semester": [["BA4002", "Business Practicum", 6]] },
  },
  BSTM: {
    "1st Year": { "1st Semester": [["TM1001", "Macro Perspective of Tourism and Hospitality", 3], ["GE1001", "Understanding the Self", 3]], "2nd Semester": [["TM1002", "Philippine Tourism, Geography and Culture", 3]] },
    "2nd Year": { "1st Semester": [["TM2001", "Tour and Travel Management", 3]], "2nd Semester": [["TM2002", "Sustainable Tourism", 3]] },
    "3rd Year": { "1st Semester": [["TM3001", "Transportation Management", 3]], "2nd Semester": [["TM3002", "Events Management", 3]] },
    "4th Year": { "1st Semester": [["TM4001", "Research in Tourism", 3]], "2nd Semester": [["TM4002", "Tourism Practicum", 6]] },
  },
  BSHM: {
    "1st Year": { "1st Semester": [["HM1001", "Kitchen Essentials and Basic Food Preparation", 3], ["GE1001", "Understanding the Self", 3]], "2nd Semester": [["HM1002", "Fundamentals in Lodging Operations", 3]] },
    "2nd Year": { "1st Semester": [["HM2001", "Applied Business Tools in Hospitality", 3]], "2nd Semester": [["HM2002", "Food and Beverage Service", 3]] },
    "3rd Year": { "1st Semester": [["HM3001", "Bar and Beverage Management", 3]], "2nd Semester": [["HM3002", "Banquet and Catering Services", 3]] },
    "4th Year": { "1st Semester": [["HM4001", "Research in Hospitality", 3]], "2nd Semester": [["HM4002", "Hospitality Practicum", 6]] },
  },
};

const SCHOLARSHIPS = [
  ["Academic Excellence Scholarship", "For incoming and continuing students with outstanding grades.", 90, null, "100% tuition", 20, ["Form 138 / latest grades", "Certificate of Good Moral Character"]],
  ["STI Entrance Scholarship", "Based on the entrance assessment (FARI) result.", 85, null, "50% tuition", 40, ["FARI assessment result", "Form 138"]],
  ["Financial Assistance Grant", "For students from low-income families.", 80, 250000, "30% tuition", 30, ["Certificate of Indigency", "ITR or Certificate of Tax Exemption"]],
  ["Sibling Discount", "For families with two or more children enrolled.", 75, null, "10% tuition", 50, ["Proof of sibling enrollment"]],
  ["Varsity Athletic Grant", "For student-athletes representing the school.", 78, null, "75% tuition", 15, ["Coach endorsement", "Medical certificate"]],
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const PROGRAM_MIX = ["BSIT", "BSIT", "BSIT", "BSIT", "BSBA", "BSBA", "BSTM", "BSHM"];

function csvRows(text) {
  const rows = []; let row = []; let cur = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

export function buildSeed({ chedCsvPath } = {}) {
  const T = {}; // table -> rows
  const add = (table, row) => (T[table] ||= []).push(row);

  // ---- reference data ----
  [["BSIT", "BS in Information Technology", 1], ["BSBA", "BS in Business Administration", 2], ["BSTM", "BS in Tourism Management", 3], ["BSHM", "BS in Hospitality Management", 4]]
    .forEach(([code, name, sort_order]) => add("programs", { code, name, sort_order }));
  add("semester_settings", { id: 1, school_year: ACTIVE.sy, semester: ACTIVE.sem, enrollment_open: true });

  const scholarshipIds = {};
  for (const [name, description, min_gwa, income_limit, coverage, slots, requirements] of SCHOLARSHIPS) {
    const id = uuid(); scholarshipIds[name] = id;
    add("scholarships", { id, name, description, min_gwa, income_limit, coverage, slots, requirements, is_active: true });
  }

  for (const [program, years] of Object.entries(CURRICULUM)) {
    for (const [year_level, sems] of Object.entries(years)) {
      for (const [semester, subjects] of Object.entries(sems)) {
        for (const [code, title, units, prereq] of subjects) {
          add("curriculum_subjects", { id: uuid(), program, year_level, semester, code, title, units, prereq: prereq ?? null, semester_availability: semester, course_id: `${program}-${code}` });
        }
      }
    }
  }
  for (const program of ["BSIT", "BSBA", "BSTM", "BSHM"]) {
    for (const [i, yl] of YEARS.entries()) {
      for (const letter of program === "BSIT" ? ["A", "B"] : ["A"]) {
        add("sections", { id: uuid(), program, year_level: yl, section_name: `${program} ${i + 1}${letter}`, school_year: ACTIVE.sy, semester: ACTIVE.sem, capacity: 40 });
      }
    }
  }

  const schoolIds = {};
  SCHOOLS.forEach(([name, type, city, lat, lng, college], i) => {
    const id = uuid(); schoolIds[name] = id;
    add("schools", { id, name, type, city, lat, lng, offers_college: college, offers_secondary: !college, registry_id: null, registry_source: null, created_at: daysAgo(400 - i) });
  });
  const originSchools = SCHOOLS.filter((s) => !s[5]).map((s) => s[0]);

  // Public registries (only the area the app searches). CHED list from the CSV in the app repo.
  if (chedCsvPath) {
    const rows = csvRows(readFileSync(chedCsvPath, "utf8")).slice(1);
    let n = 0;
    for (const r of rows) {
      const [region, name, type, province, city] = r.map((x) => (x || "").trim());
      if (!name || !/muntinlupa|para.aque|san pedro|las pi.as/i.test(city)) continue;
      add("ched_hei_list", { institution_code: `DEMO-${++n}`, institution_name: name, region, province, city_municipality: city, address: null, type, status: "Active" });
    }
  }
  originSchools.forEach((name, i) => {
    const s = SCHOOLS.find((x) => x[0] === name);
    const division = { Muntinlupa: "Muntinlupa City", "Parañaque": "Parañaque City", "San Pedro": "San Pedro City", "Las Piñas": "Las Piñas City" }[s[2]];
    add("deped_masterlist", { beis_id: String(305000 + i * 17), school_name: name, level_code: "SHS", level_label: "Senior High School", region: s[2] === "San Pedro" ? "Region IV-A" : "NCR", province: s[2] === "San Pedro" ? "Laguna" : "Metro Manila", municipality: s[2], division, lat: s[3], lng: s[4] });
  });

  // ---- people ----
  const people = [];
  const usedNames = new Set(["Bianca|Reyes"]);
  const newPerson = (extra = {}) => {
    let first, last;
    do { first = pick(FIRST); last = pick(LAST); } while (usedNames.has(`${first}|${last}`));
    usedNames.add(`${first}|${last}`);
    const p = { first, last, email: `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, "") + "@sti360.demo", phone: `09${int(10, 99)}${int(1000000, 9999999)}`, ...extra };
    people.push(p);
    return p;
  };

  // Leads (marketing pipeline), some later enroll.
  const leadStatuses = ["new", "new", "contacted", "contacted", "qualified", "pending_documents", "enrolled", "enrolled", "lost"];
  const sources = ["feeder_school", "feeder_school", "social_media", "walk_in", "referral", "other"];
  const leads = [];
  for (let i = 0; i < 90; i++) {
    const p = newPerson();
    const school = pick(originSchools);
    const lead = { id: uuid(), first_name: p.first, last_name: p.last, email: p.email, phone: p.phone, school_id: schoolIds[school], status: pick(leadStatuses), created_at: daysAgo(int(5, 200)).replace("Z", ""), source: pick(sources), notes: chance(0.3) ? "Asked about scholarship options." : null, school_name: school, is_feeder: SCHOOLS.find((s) => s[0] === school)[1] === "feeder", suffix: null };
    leads.push({ ...lead, person: p });
    const { person, ...row } = { ...lead, person: p };
    add("leads", row);
  }

  // Students: a cohort per starting term; each gets one enrollment per term until they stop.
  let sidN = 2000310000;
  const students = [];
  const makeStudent = (p, program, startYearIdx, startTerm, opts = {}) => {
    const s = { ...p, program, startYearIdx, startTerm, student_id: String(sidN += int(3, 41)), lrn: String(int(100000, 999999)) + String(int(100000, 999999)), school: opts.school || pick(originSchools), type: opts.type || (chance(0.15) ? "Irregular" : "Regular"), stopAfter: opts.stopAfter ?? (chance(0.12) ? int(startTerm, TERMS.length - 2) : 99), scholarship: opts.scholarship ?? (chance(0.25) ? pick(SCHOLARSHIPS)[0] : null), lead: opts.lead || null, gwa: round2(80 + rnd() * 17), userId: opts.userId || null };
    students.push(s);
    return s;
  };
  // Enrolled leads become first-years this term.
  for (const l of leads.filter((x) => x.status === "enrolled")) makeStudent(l.person, pick(PROGRAM_MIX), 0, 4, { school: l.school_name, lead: l.id, stopAfter: 99 });
  for (let i = 0; i < 150; i++) makeStudent(newPerson(), pick(PROGRAM_MIX), int(0, 3), pick([0, 0, 2, 2, 4]));
  // The demo student: BSIT, started 2024-2025 as a 1st year, now a 3rd year.
  const me = makeStudent({ first: DEMO.student.first, last: DEMO.student.last, email: DEMO.student.email, phone: "09171234567" }, "BSIT", 0, 0, { school: "Muntinlupa Science High School", type: "Regular", stopAfter: 99, scholarship: "Academic Excellence Scholarship", userId: DEMO.student.id });
  me.student_id = "2000312345"; me.gwa = 93.4;

  const enrollmentsBySid = {};
  for (const s of students) {
    let lastEnr = null;
    for (let t = s.startTerm; t < TERMS.length && t <= s.stopAfter; t++) {
      const yearIdx = s.startYearIdx + Math.floor((t - s.startTerm) / 2) - (s.startTerm % 2 === 1 ? 0 : 0);
      if (yearIdx > 3) break;
      const [sy, sem] = TERMS[t];
      const sch = s.scholarship && scholarshipIds[s.scholarship];
      const e = {
        id: uuid(), lead_id: t === s.startTerm ? s.lead : null, school_id: schoolIds[s.school], enrollment_date: `${sy.slice(t % 2 ? 5 : 0, t % 2 ? 9 : 4)}-${t % 2 ? "01" : "08"}-${String(int(1, 20)).padStart(2, "0")}T09:00:00`,
        student_id: s.student_id, education_level: "college", grade_level: null, section: `${s.program} ${yearIdx + 1}${pick(["A", "A", "B"])}`, course: s.program,
        scholarship_type: s.scholarship || "none", is_walk_in: !s.lead && chance(0.2), email: s.email, phone: s.phone,
        created_at: `${sy.slice(t % 2 ? 5 : 0, t % 2 ? 9 : 4)}-${t % 2 ? "01" : "08"}-10T09:00:00Z`, first_name: s.first, last_name: s.last,
        scholarship_status: s.scholarship ? pick(["approved", "approved", "pending"]) : "pending",
        shs_gwa: t === s.startTerm ? s.gwa : null, shs_math_grade: t === s.startTerm ? round2(78 + rnd() * 20) : null, shs_english_grade: t === s.startTerm ? round2(78 + rnd() * 20) : null,
        year_level: YEARS[yearIdx], school_year: sy, semester: sem, scholarship_id: sch || null, user_id: s.userId,
        student_type: s.type, school_name: s.school,
      };
      add("enrollments", e);
      (enrollmentsBySid[s.student_id] ||= []).push(e);
      lastEnr = e;
    }
    s.lastEnr = lastEnr;
  }

  // Document checklist for current-term enrollees.
  const DOCS = ["Form 138 (Report Card)", "PSA Birth Certificate", "Certificate of Good Moral Character", "2x2 ID Picture"];
  for (const s of students) {
    if (!s.lastEnr || s.lastEnr.school_year !== ACTIVE.sy) continue;
    if (!(s.startTerm === 4 || chance(0.35) || s === me)) continue;
    for (const doc of DOCS) {
      const received = s === me || chance(0.7);
      add("enrollment_requirements", { id: uuid(), enrollment_id: s.lastEnr.id, document_name: doc, is_required: doc !== "2x2 ID Picture", status: received ? "received" : "to_follow", received_at: received ? daysAgo(int(20, 90)) : null, notes: null,
        extraction_status: doc.startsWith("Form 138") && received ? pick(["extracted", "verified", "needs_review"]) : null,
        shs_gwa: doc.startsWith("Form 138") && received ? s.gwa : null });
    }
  }

  // Scholars uploaded by the admin.
  for (const s of students.filter((x) => x.scholarship && x.lastEnr)) {
    add("scholar_batch", { id: uuid(), email: s.email, student_name: `${s.last}, ${s.first}`, scholarship_type: s.scholarship, scholarship_name: s.scholarship, scholar_status: s.lastEnr.school_year === ACTIVE.sy ? "active" : "inactive", school_year: s.lastEnr.school_year, semester: s.lastEnr.semester, notes: null });
  }

  // Graduating list: 4th years of 2025-2026 2nd semester graduated; current 4th years pending.
  const gradRows = [];
  for (const s of students) {
    for (const e of enrollmentsBySid[s.student_id] || []) {
      if (e.year_level !== "4th Year" || e.semester !== "2nd Semester") continue;
      gradRows.push({ s, e });
    }
  }
  for (const { s, e } of gradRows) {
    add("graduating_students", { id: uuid(), student_id: s.student_id, first_name: s.first, last_name: s.last, email: s.email, course: s.program, strand: null, education_level: "college", school_year: e.school_year, gwa: round2(1.25 + rnd() * 1.5), remarks: null, graduation_date: e.school_year === "2025-2026" ? "2026-06-20" : "2025-06-21", status: chance(0.9) ? "graduated" : "withdrawn", enrollment_id: e.id, created_by_admin: true });
  }
  for (const s of students.filter((x) => x.lastEnr?.school_year === ACTIVE.sy && x.lastEnr.year_level === "4th Year")) {
    add("graduating_students", { id: uuid(), student_id: s.student_id, first_name: s.first, last_name: s.last, email: s.email, course: s.program, strand: null, education_level: "college", school_year: "2026-2027", gwa: round2(1.25 + rnd() * 1.5), remarks: null, graduation_date: null, status: pick(["pending", "pending", "confirmed"]), enrollment_id: s.lastEnr.id, created_by_admin: true });
  }

  // Employment (tracer) surveys of graduates.
  const companies = [["Accenture Philippines", "IT Services", "Associate Software Engineer"], ["Concentrix", "BPO", "Technical Support Representative"], ["Globe Telecom", "Telecommunications", "Network Operations Analyst"], ["BDO Unibank", "Banking", "Branch Operations Associate"], ["Jollibee Foods Corporation", "Food Service", "Management Trainee"], ["Shangri-La The Fort", "Hospitality", "Guest Services Agent"], ["Freelance", "Digital Services", "Web Developer"]];
  for (const { s, e } of gradRows.filter((x) => chance(0.75))) {
    const employed = chance(0.72);
    const [company, industry, job] = pick(companies);
    add("employment_surveys", { id: uuid(), student_id: s.student_id, first_name: s.first, last_name: s.last, email: s.email, course: s.program, graduation_year: Number(e.school_year.slice(5)), school_year: e.school_year,
      employment_status: employed ? (company === "Freelance" ? "Self-employed" : "Employed") : "Unemployed", company_name: employed ? company : null, job_title: employed ? job : null, industry: employed ? industry : null,
      monthly_salary: employed ? int(16, 38) * 1000 : null, months_to_employment: employed ? int(0, 8) : null, unemployment_reason: employed ? null : pick(["Pursuing further studies", "Still looking for work", "Family reasons"]),
      is_aligned_to_course: employed ? chance(0.7) : null, survey_date: dateOnly(daysAgo(int(20, 160))), remarks: null, enrollment_id: e.id, privacy_consent: true, is_employed: employed,
      employment_type: employed ? (company === "Freelance" ? "Entrepreneur/Freelancer" : "Employee") : null, job_status: employed && company !== "Freelance" ? pick(["Regular/Permanent", "Probationary", "Project-based"]) : null,
      employment_location: employed ? (chance(0.08) ? "Abroad" : "Local") : null, looking_for_job: !employed, employment_source: employed ? pick(["STI Job Fair", "STI I-CARES Portal", "Other Non-STI Activity"]) : null });
  }

  // ---- FARI entrance assessment ----
  const Q = [];
  const sec = (section_key, items) => items.forEach((it) => Q.push({ section_key, ...it }));
  sec("reading_verbal", [
    { q: "Choose the word closest in meaning to DILIGENT.", o: ["Careless", "Hardworking", "Talkative", "Hesitant"], a: "B" },
    { q: "Choose the word opposite in meaning to SCARCE.", o: ["Rare", "Limited", "Abundant", "Expensive"], a: "C" },
    { q: "Complete the analogy: Book is to reading as fork is to ___.", o: ["Drawing", "Writing", "Eating", "Stirring"], a: "C" },
    { q: "Which sentence is grammatically correct?", o: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."], a: "C" },
    { q: "Based on the passage, what is the main reason the town built the seawall?", o: ["To attract tourists", "To protect homes from storm surges", "To create a fishing port", "To mark the town border"], a: "B", passage: "After two typhoons flooded the coastal barangays in three years, the town council approved a seawall to keep storm surges away from the houses along the shore." },
    { q: "Choose the correctly spelled word.", o: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"], a: "C" },
    { q: "What does the idiom 'break the ice' mean?", o: ["To start a conversation", "To end a friendship", "To make a mistake", "To leave early"], a: "A" },
    { q: "Choose the word that best completes the sentence: The results were ___ than expected.", o: ["good", "better", "best", "well"], a: "B" },
  ]);
  sec("numerical", [
    { q: "What is 15% of 240?", o: ["24", "32", "36", "40"], a: "C" },
    { q: "If 3x + 5 = 20, what is x?", o: ["3", "5", "6", "15"], a: "B" },
    { q: "What comes next: 2, 6, 12, 20, 30, ___?", o: ["36", "40", "42", "44"], a: "C" },
    { q: "A jeepney ride costs ₱13 for the first 4 km and ₱1.80 for each km after. How much is a 9 km ride?", o: ["₱20.20", "₱22.00", "₱24.80", "₱29.20"], a: "B" },
    { q: "Simplify: (8 × 3) ÷ 4 + 2", o: ["6", "8", "10", "12"], a: "B" },
    { q: "The average of 4 numbers is 25. Three of them are 20, 30 and 22. What is the fourth?", o: ["24", "26", "28", "30"], a: "C" },
    { q: "What is 0.25 written as a fraction?", o: ["1/2", "1/3", "1/4", "2/5"], a: "C" },
    { q: "A shirt priced at ₱800 is sold at 25% off. What is the sale price?", o: ["₱550", "₱600", "₱625", "₱650"], a: "B" },
  ]);
  sec("abstract", [
    { q: "Which figure completes the pattern: circle, square, triangle, circle, square, ___?", o: ["Circle", "Square", "Triangle", "Pentagon"], a: "C" },
    { q: "Which letter comes next: A, C, F, J, ___?", o: ["M", "N", "O", "P"], a: "C" },
    { q: "Find the odd one out: 3, 5, 7, 9, 11", o: ["3", "5", "9", "11"], a: "C" },
    { q: "If all Zips are Zaps and some Zaps are Zops, which must be true?", o: ["All Zops are Zips", "Some Zips may be Zops", "No Zips are Zops", "All Zaps are Zips"], a: "B" },
    { q: "Which number completes the grid row 2, 4, 8 / 3, 9, 27 / 4, 16, ___?", o: ["32", "48", "64", "60"], a: "C" },
    { q: "A cube is painted on all sides and cut into 27 equal cubes. How many small cubes have no paint?", o: ["0", "1", "6", "8"], a: "B" },
  ]);
  sec("digital_literacy", [
    { q: "Which of these is the safest password?", o: ["password123", "Juan1990", "T!g3r-Rain#82", "qwerty"], a: "C" },
    { q: "What does 'URL' stand for?", o: ["Uniform Resource Locator", "Universal Read Link", "User Response Log", "Unified Routing Line"], a: "A" },
    { q: "Which file type is a spreadsheet?", o: [".docx", ".xlsx", ".pptx", ".mp4"], a: "B" },
    { q: "An email asks you to confirm your bank PIN through a link. What should you do?", o: ["Reply with the PIN", "Click the link", "Report it as phishing", "Forward it to friends"], a: "C" },
    { q: "Which key combination copies selected text on Windows?", o: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + Z"], a: "B" },
    { q: "What is the main purpose of an LMS like eLMS?", o: ["Online games", "Managing course materials and activities", "Video editing", "Banking"], a: "B" },
  ]);
  const grit = ["I finish whatever I begin.", "Setbacks don't discourage me for long.", "I am a hard worker.", "I stay focused on long projects.", "I keep going even when tasks get difficult.", "I can manage my time between school and other responsibilities.", "I ask for help when I don't understand a lesson.", "I study even when there is no exam coming.", "I believe effort improves my abilities.", "I set goals and work toward them."];
  sec("psychometric", grit.map((q) => ({ q, o: ["Strongly disagree", "Disagree", "Neutral", "Agree"], a: null })));
  const questionIds = [];
  Q.forEach((x, i) => {
    const id = uuid(); questionIds.push({ id, section: x.section_key, a: x.a });
    add("fari_questions", { id, item_number: i + 1, section_key: x.section_key, passage_context: x.passage || null, question_text: x.q, options: { A: x.o[0], B: x.o[1], C: x.o[2], D: x.o[3] }, correct_answer: x.a });
  });

  // Exam accounts + submissions for some leads / new enrollees.
  const examTakers = [...leads.filter((l) => ["qualified", "pending_documents", "enrolled"].includes(l.status)).slice(0, 28)];
  examTakers.forEach((l, i) => {
    const accId = uuid();
    add("temp_exam_accounts", { id: accId, student_name: `${l.first_name} ${l.last_name}`, student_lrn: String(100000000000 + i * 7919), email: `exam${String(i + 1).padStart(3, "0")}@sti360.local`, password: "demo-only", source: "lead", source_id: l.id, is_used: i < 22, expires_at: daysAgo(-7), created_at: daysAgo(int(10, 60)), first_name: l.first_name, last_name: l.last_name, phone: l.phone, opened_at: i < 22 ? daysAgo(int(5, 40)) : null });
    if (i >= 22) return;
    const skill = 0.35 + rnd() * 0.6;
    const answers = {};
    const raw = { reading_verbal: 0, numerical: 0, abstract: 0, digital_literacy: 0 };
    let psy = 0;
    for (const q of questionIds) {
      if (q.section === "psychometric") { const v = Math.max(1, Math.min(5, Math.round(1 + skill * 4 + (rnd() - 0.5) * 2))); answers[q.id] = String(v); psy += v; }
      else { const ok = rnd() < skill; answers[q.id] = ok ? q.a : pick(["A", "B", "C", "D"].filter((c) => c !== q.a)); if (ok) raw[q.section]++; }
    }
    add("fari_submissions", { id: uuid(), temp_account_id: accId, student_name: `${l.first_name} ${l.last_name}`, student_lrn: String(100000000000 + i * 7919), raw_reading_verbal: raw.reading_verbal, raw_numerical: raw.numerical, raw_abstract: raw.abstract, raw_digital_literacy: raw.digital_literacy, raw_psychometric_sum: psy, item_answers: answers, submitted_at: daysAgo(int(3, 40)), status: chance(0.6) ? "finalized" : "pending" });
  });

  // Form 138 grades encoded by front desk.
  for (const s of students.filter((x) => x.startTerm === 4).slice(0, 25)) {
    add("form138_grades", { id: uuid(), student_lrn: s.lrn, student_name: `${s.last}, ${s.first}`, grade_level: "Grade 12", school_year: "2025-2026", subjects: [{ subject: "Oral Communication", grade: int(82, 97) }, { subject: "General Mathematics", grade: int(78, 96) }, { subject: "Earth and Life Science", grade: int(80, 95) }, { subject: "Empowerment Technologies", grade: int(84, 98) }], general_average: s.gwa, remarks: "Promoted", encoded_by: "frontdesk@sti360.demo" });
  }

  // Counseling.
  const counseled = students.filter((x) => x.lastEnr).slice(10, 16);
  counseled.forEach((s, i) => {
    const key = `id:${s.student_id}`;
    const status = ["contacted", "in_counseling", "resolved", "new", "referred", "in_counseling"][i];
    add("at_risk_cases", { case_key: key, student_id: s.student_id, student_name: `${s.last}, ${s.first}`, status, follow_up_date: status === "resolved" ? null : dateOnly(daysAgo(-int(2, 14))), updated_at: daysAgo(int(1, 20)), updated_by: null, updated_by_email: "guidance@sti360.demo", referred_to: status === "referred" ? "Clinic / Psychologist" : null, remarks: "Follow-up on attendance and study habits." });
    add("counseling_records", { id: uuid(), student_id: s.student_id, enrollment_id: s.lastEnr.id, first_name: s.first, last_name: s.last, email: s.email, course: s.program, concern: pick(["Academic performance", "Attendance", "Time management", "Career guidance"]), session_date: dateOnly(daysAgo(int(5, 60))), session_type: pick(["Individual", "Walk-in", "Referral"]), counselor_notes: "Discussed a weekly study plan; student agreed to a follow-up session.", follow_up_date: null, status: "open", case_key: key });
  });

  // Reports submitted by each office.
  const reportDefs = [["marketing", "Monthly Leads Summary", "leads_summary"], ["frontdesk", "Enrollment Status Report", "enrollment_status"], ["guidance", "Counseling Activity Report", "counseling_summary"], ["marketing", "Feeder School Performance", "school_performance"], ["frontdesk", "Pending Documents Report", "pending_documents"], ["guidance", "Graduate Tracer Summary", "employment_summary"]];
  for (let m = 0; m < 3; m++) {
    reportDefs.forEach(([role, title, type], i) => {
      const month = 10 - m; // Nov, Oct, Sep 2026 (0-based 10 = November)
      const label = new Date(Date.UTC(2026, month, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
      add("reports", { id: uuid(), title, type, generated_by: null, data: [{ metric: "Records", value: int(12, 140) }, { metric: "Change vs last month", value: `${int(-8, 15)}%` }], status: "completed", created_at: new Date(Date.UTC(2026, month, Math.min(28, 2 + i * 4), 8)).toISOString().replace("Z", ""), role_target: role, period_label: label, is_auto: i % 2 === 0, scheduled_month: month + 1, scheduled_year: 2026 });
    });
  }

  // ---- accounts ----
  const accounts = [
    [DEMO.admin.email, DEMO.admin.first, DEMO.admin.last, "admin"],
    [DEMO.superuser.email, DEMO.superuser.first, DEMO.superuser.last, "superuser"],
    ["frontdesk@sti360.demo", "Lorna", "Dimaculangan", "frontdesk"],
    ["marketing@sti360.demo", "Jessa", "Panganiban", "marketing"],
    ["guidance@sti360.demo", "Maricel", "Bernardo", "guidance"],
    [DEMO.student.email, DEMO.student.first, DEMO.student.last, "student"],
    ...students.filter((s) => s !== me && s.lastEnr?.school_year === ACTIVE.sy).slice(0, 30).map((s) => [s.email, s.first, s.last, "student"]),
  ];
  accounts.forEach(([email, first_name, last_name, role], i) => add("authorized_accounts", { id: uuid(), email, first_name, last_name, role, is_active: true, created_at: daysAgo(300 - i) }));

  // Demo student's own records.
  add("student_profiles", { id: DEMO.student.id, student_id: me.student_id, first_name: me.first, middle_name: "Santos", last_name: me.last, suffix: null, email: me.email, phone: me.phone, birthdate: "2005-03-14", gender: "Female", nationality: "Filipino", civil_status: "Single", religion: "Roman Catholic", address: "Blk 4 Lot 12 Sampaguita St.", city: "Muntinlupa", barangay: "Putatan", zip_code: "1772", program: "BSIT", year_level: "3rd Year", section: "BSIT 3A", onboarded: true, student_type: "Regular", sem_updated: true, annual_family_income: 420000 });
  const gradeFor = () => { const s = int(78, 97); const fg = s >= 97 ? "1.00" : s >= 94 ? "1.25" : s >= 91 ? "1.50" : s >= 88 ? "1.75" : s >= 85 ? "2.00" : s >= 82 ? "2.25" : s >= 79 ? "2.50" : "2.75"; return { s, fg }; };
  const myTerms = [["1st Year", "1st Semester", "2024-2025"], ["1st Year", "2nd Semester", "2024-2025"], ["2nd Year", "1st Semester", "2025-2026"], ["2nd Year", "2nd Semester", "2025-2026"]];
  for (const [yl, sem, sy] of myTerms) {
    for (const [code] of CURRICULUM.BSIT[yl][sem]) {
      const { s, fg } = gradeFor();
      add("student_grades", { id: uuid(), student_id: DEMO.student.id, subject_code: code, grade: fg, school_year: sy, semester: sem, grade_type: "final", verified: true, prelim: s - int(0, 4), midterm: s - int(0, 3), pre_finals: s + int(-2, 2), finals: s + int(-1, 3), final_grade: fg });
    }
  }
  for (const [code] of CURRICULUM.BSIT["3rd Year"]["1st Semester"]) {
    const { s } = gradeFor();
    add("student_grades", { id: uuid(), student_id: DEMO.student.id, subject_code: code, grade: null, school_year: ACTIVE.sy, semester: ACTIVE.sem, grade_type: "partial", verified: false, prelim: s, midterm: s + int(-3, 3), pre_finals: null, finals: null, final_grade: null });
  }

  // A few archived items so the Archive tab has something to show.
  const archivedLeads = T.leads.slice(-3);
  T.leads = T.leads.slice(0, -3);
  archivedLeads.forEach((l, i) => add("archived_records", { id: uuid(), source_table: "leads", source_id: l.id, archived_data: l, archived_by: DEMO.admin.id, archived_by_email: DEMO.admin.email, archive_reason: ["Duplicate entry", "Lead withdrew interest", "Wrong contact details"][i], archived_at: daysAgo(3 + i * 4), related: { cascade: [], relink: [] } }));

  // Activity log.
  const actions = [["login", "admin logged in"], ["update", "curriculum_subjects: updated units (Networking 2)"], ["create", "scholarships: created record (Varsity Athletic Grant)"], ["update", "semester_settings: updated semester"], ["create", "graduating_students: created record"], ["ARCHIVE", "leads archived"]];
  for (let i = 0; i < 24; i++) {
    const [action, details] = pick(actions);
    add("audit_logs", { id: uuid(), action, actor_id: DEMO.admin.id, actor_email: DEMO.admin.email, target_email: null, details, created_at: daysAgo(i, 8 + (i % 9)) });
  }

  return T;
}

export function authSql() {
  const u = (x, signIn) => `('${x.id}', '${x.email}', '${signIn}', '{"provider":"google","providers":["google"]}', '{"full_name":"${x.first} ${x.last}","name":"${x.first} ${x.last}"}')`;
  return `insert into auth.users (id, email, last_sign_in_at, raw_app_meta_data, raw_user_meta_data) values
    ${u(DEMO.admin, "2026-11-18T08:00:00Z")}, ${u(DEMO.student, "2026-11-18T08:00:00Z")}, ${u(DEMO.superuser, "2026-11-17T10:00:00Z")};`;
}
