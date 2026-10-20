import express from "express";
import cors from "cors";
import pg from "pg";

const PORT = Number(process.env.PORT ?? 4004);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL ?? "postgres://pensee:pensee@localhost:5434/pensee" });

// Chaque routine Project Zero définit les champs attendus.
const ROUTINES: Record<string, string[]> = {
  "see-think-wonder": ["see", "think", "wonder"],
  "used-to-think": ["used", "now", "why"],
};

const app = express();
app.use(cors({ origin: (process.env.CORS_ORIGIN ?? "http://localhost:5174").split(",") }));
app.use(express.json());

await pool.query(`CREATE TABLE IF NOT EXISTS reflections (
  id SERIAL PRIMARY KEY, routine TEXT NOT NULL, topic TEXT NOT NULL, author TEXT NOT NULL,
  answers JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`);

app.post("/api/reflections", async (req, res) => {
  const routine = String(req.body?.routine ?? "");
  const topic = String(req.body?.topic ?? "").trim().slice(0, 200);
  const author = String(req.body?.author ?? "").trim().slice(0, 50) || "Anonyme";
  const fields = ROUTINES[routine];
  if (!fields || !topic) return res.status(400).json({ error: "Routine ou sujet invalide." });
  const answers: Record<string, string> = {};
  for (const f of fields) {
    const v = String(req.body?.answers?.[f] ?? "").trim().slice(0, 1000);
    if (v.length < 10) return res.status(400).json({ error: `Le champ « ${f} » doit contenir au moins 10 caractères.` });
    answers[f] = v;
  }
  const { rows } = await pool.query("INSERT INTO reflections (routine, topic, author, answers) VALUES ($1,$2,$3,$4) RETURNING *", [routine, topic, author, answers]);
  res.status(201).json(rows[0]);
});

app.get("/api/reflections", async (req, res) => {
  const routine = typeof req.query.routine === "string" ? req.query.routine : null;
  const { rows } = await pool.query("SELECT * FROM reflections WHERE ($1::text IS NULL OR routine = $1) ORDER BY created_at DESC LIMIT 200", [routine]);
  res.json(rows);
});

// Documentation : export Markdown de toutes les productions (le « portfolio » de la classe)
app.get("/api/export.md", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM reflections ORDER BY created_at");
  const labels: Record<string, string> = { see: "Je vois", think: "Je pense", wonder: "Je me demande", used: "Avant, je pensais", now: "Maintenant, je pense", why: "Ce qui a changé" };
  const md = ["# Journal de pensée — portes ouvertes\n", ...rows.map((r) =>
    `## ${r.topic}\n*${r.routine} — ${r.author} — ${new Date(r.created_at).toLocaleString("fr-CA")}*\n\n` +
    Object.entries(r.answers).map(([k, v]) => `- **${labels[k] ?? k}** : ${v}`).join("\n") + "\n")].join("\n");
  res.type("text/markdown; charset=utf-8").setHeader("Content-Disposition", 'attachment; filename="journal-pensee.md"').send(md);
});
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Pensée visible (API) : http://localhost:${PORT}`));
