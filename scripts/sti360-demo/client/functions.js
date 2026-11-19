// Stand-ins for STI-360's Supabase Edge Functions. The real ones call Microsoft Graph,
// Google Gemini or object storage; offline, they answer with sample results.

const ZONE_TEXT = { green: "ready for college-level work", yellow: "ready with some support", red: "likely to need close support" };

async function analyzeAssessment(body, withDb, claims) {
  const id = body?.submission_id;
  const sub = await withDb(claims, async (db) => (await db.query("select * from public.fari_submissions where id = $1", [id])).rows[0]);
  if (!sub) return { status: 404, body: { error: "Submission not found." } };
  const max = sub.section_max || { reading_verbal: 8, numerical: 8, abstract: 6, digital_literacy: 6, psychometric: 10 };
  const pct = (raw, m) => Math.round((100 * (raw || 0)) / Math.max(m || 1, 1));
  const s = {
    reading: pct(sub.raw_reading_verbal, max.reading_verbal), numerical: pct(sub.raw_numerical, max.numerical),
    abstract: pct(sub.raw_abstract, max.abstract), digital: pct(sub.raw_digital_literacy, max.digital_literacy),
  };
  const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const label = { reading: "reading and verbal reasoning", numerical: "numerical reasoning", abstract: "abstract reasoning", digital: "digital literacy" };
  const zone = sub.zone || "yellow";
  const wss = Number(sub.wss ?? 0).toFixed(1);
  const fit = (p) => (p >= 75 ? "strong" : p >= 55 ? "moderate" : p >= 40 ? "exploratory" : "needs_support");
  const analysis = {
    summary: `${sub.student_name} scored ${wss} / 100 (${zone} zone), ${ZONE_TEXT[zone] || "review needed"}. Strongest area: ${label[ranked[0][0]]} (${ranked[0][1]}%); the area to watch is ${label[ranked[3][0]]} (${ranked[3][1]}%).`,
    readiness_level: zone === "green" ? "ready" : zone === "yellow" ? "ready with support" : "needs support",
    fari_profile: { name: zone === "green" ? "Self-directed achiever" : zone === "yellow" ? "Developing learner" : "Needs structured support", rationale: "Based on the four academic sections and the persistence (grit) items of the FARI assessment." },
    strengths: ranked.slice(0, 2).map(([k, v]) => `Good ${label[k]} (${v}% of items correct).`),
    development_areas: ranked.slice(2).map(([k, v]) => `${label[k][0].toUpperCase()}${label[k].slice(1)} ${v < 60 ? "needs practice" : "is relatively weaker"} (${v}% correct).`),
    insights: ["Section scores are fairly consistent, so the result is likely a fair picture of current readiness.", "Self-reported persistence is in line with the academic results."],
    recommended_supports: zone === "red" ? ["Enroll in the peer tutoring program in the first semester.", "Schedule a guidance check-in within the first month."] : ["Join the first-year orientation on the eLMS.", "Offer optional math refresher sessions."],
    program_fit: [
      { program: "BS in Information Technology", fit_level: fit((s.numerical + s.abstract + s.digital) / 3), rationale: "Draws on numerical, abstract and digital skills.", watch_out: s.numerical < 50 ? "Math-heavy first-year subjects may need tutoring." : null },
      { program: "BS in Business Administration", fit_level: fit((s.reading + s.numerical) / 2), rationale: "Balances communication and quantitative work.", watch_out: null },
      { program: "BS in Tourism Management", fit_level: fit(s.reading), rationale: "Relies on communication and reading skills.", watch_out: null },
    ],
    course_fit_observations: ["Program choice should also weigh the student's interests and Form 138 grades."],
    action_plan: [{ action: "Review this result with the student during enrollment counseling.", timeframe: "Before classes start" }, { action: "Check first prelim grades in the weakest area.", timeframe: "Week 6" }],
    grades_crosscheck: "No Form 138 grades were linked to this submission in the demo data.",
    counselor_note: "Sample analysis generated offline for the portfolio demo (the live system uses Google Gemini).",
    disclaimer: "This analysis supports, but does not replace, a counselor's judgment.",
  };
  return { status: 200, body: { analysis, interpretation: [], flags: [], data_quality_notes: [], model: "offline-demo", crosscheck: null, form138: null } };
}

export async function invokeFunction(name, body, claims, withDb) {
  switch (name) {
    case "analyze-assessment": return analyzeAssessment(body, withDb, claims);
    case "check-superuser-status": return { status: 200, body: { status: "ok", checked: 1 } };
    case "archive-vault": {
      const action = body?.action;
      if (action === "sweep") return { status: 200, body: { moved: 0, message: "Nothing old enough to move to long-term storage." } };
      if (action === "list" || action === "snapshots") return { status: 200, body: { items: [] } };
      return { status: 200, body: { error: "Long-term archive files aren't stored in the offline demo." } };
    }
    case "create-user": return { status: 200, body: { error: "Creating accounts is disabled in the demo." } };
    default: return { status: 404, body: { error: `Function ${name} isn't available in the demo.` } };
  }
}
