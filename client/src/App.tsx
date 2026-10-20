import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "";

type RoutineId = "see-think-wonder" | "used-to-think";
type Step = { key: string; title: string; prompt: string; starter: string };
type Reflection = { id: number; routine: RoutineId; topic: string; author: string; answers: Record<string, string>; created_at: string };

const ROUTINES: Record<RoutineId, { name: string; intro: string; steps: Step[] }> = {
  "see-think-wonder": {
    name: "Voir – Penser – Se demander",
    intro: "Observer avant d'interpréter, puis laisser naître la curiosité.",
    steps: [
      { key: "see", title: "Je vois", prompt: "Décrivez uniquement ce que vous observez. Pas d'opinion, pas d'explication.", starter: "Je vois…" },
      { key: "think", title: "Je pense", prompt: "Que pensez-vous qu'il se passe ? Qu'est-ce qui vous fait dire cela ?", starter: "Je pense que… parce que…" },
      { key: "wonder", title: "Je me demande", prompt: "Quelles questions ou curiosités cela fait-il naître ?", starter: "Je me demande…" },
    ],
  },
  "used-to-think": {
    name: "Avant je pensais… Maintenant je pense…",
    intro: "Mesurer comment une idée a évolué après une expérience.",
    steps: [
      { key: "used", title: "Avant, je pensais", prompt: "Qu'est-ce que vous croyiez à propos de ce sujet avant la visite ?", starter: "Avant, je pensais que…" },
      { key: "now", title: "Maintenant, je pense", prompt: "Qu'est-ce que vous pensez maintenant ?", starter: "Maintenant, je pense que…" },
      { key: "why", title: "Ce qui a changé", prompt: "Qu'est-ce qui a fait évoluer votre idée ?", starter: "Ce qui a changé mon idée, c'est…" },
    ],
  },
};

const STIMULI = [
  { emoji: "🤖", label: "Un robot livreur qui traverse la rue" },
  { emoji: "📡", label: "Une salle de serveurs allumée la nuit" },
  { emoji: "💬", label: "Un chatbot qui répond avec assurance à une fausse question" },
  { emoji: "🧑‍💻", label: "Deux personnes qui programment devant le même écran" },
];

const MIN_CHARACTERS = 10;
const MAX_CHARACTERS = 1000;

export default function App() {
  const [view, setView] = useState<"form" | "gallery">("form");
  const [step, setStep] = useState(0); // 0 = choix, 1..3 = étapes, 4 = relecture, 5 = merci
  const [routine, setRoutine] = useState<RoutineId>("see-think-wonder");
  const [stimulus, setStimulus] = useState(STIMULI[0]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [author, setAuthor] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Reflection[]>([]);
  const [filter, setFilter] = useState<"" | RoutineId>("");

  const r = ROUTINES[routine];
  const current = step >= 1 && step <= 3 ? r.steps[step - 1] : null;
  const value = current ? answers[current.key] ?? "" : "";
  // Validation côté interface : espaces seuls non acceptés.
  const trimmedValue = value.trim();
  const valid = trimmedValue.length >= MIN_CHARACTERS;

  const validationMessage = `Votre réponse doit contenir au moins ${MIN_CHARACTERS} caractères.`;


  function reset() {
    setStep(0);
    setAnswers({});
    setAuthor("");
    setError("");
    setSaving(false);
  }
  function updateAnswer(key: string, newValue: string) {
    setAnswers((previous) => ({
      ...previous,
      [key]: newValue,
    }));

    // Efface l'erreur dès que la personne modifie sa réponse.
    setError("");
  }

  function continueToNextStep() {
    if (!current) return;
    if (!valid) {
      setError(validationMessage);
      return;
    }

    setError("");
    // Après la troisième réponse, passer à la relecture.
    if (step === 3)
    { setStep(4);
    } else {
      setStep(step + 1);
    }
  }

  function goBack() {
    setError("");
    if (step > 0) {
      setStep(step - 1);
    }
  }

  async function submit() {
    // Dernière vérification avant l'envoi au serveur.
    const allAnswersValid = r.steps.every((s) => {
      const answer = answers[s.key] ?? "";
      return answer.trim().length >= MIN_CHARACTERS;
    });

    if (!allAnswersValid) {
      setError( "Certaines réponses sont trop courtes. Revenez aux étapes concernées et ajoutez au moins 10 caractères." );
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/reflections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          routine,
          topic: `${stimulus.emoji} ${stimulus.label}`,
          author: author.trim(),
          answers })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
            data.error ||
            "L'enregistrement a échoué. Vérifiez vos réponses et réessayez."
        );
      }

      setStep(5);
    } catch (e) {
      setError(
          e instanceof Error && e.message
              ? e.message : "Enregistrement impossible. Vos réponses sont conservées : réessayez.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (view !== "gallery") return;

    let cancelled = false;

    async function loadReflections() {
      setError("");

      try {
        const response = await fetch(
            `${API}/api/reflections${filter ? `?routine=${filter}` : ""}`
        );

        if (!response.ok) {
          throw new Error("Impossible de charger la galerie.");
        }

        const data = await response.json();

        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setError(
              "Impossible de charger la galerie. Vérifiez que le serveur est démarré."
          );
        }
      }
    }

    loadReflections();
    return () => {
      cancelled = true;
    };
    }, [view, filter]);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <header className="mx-auto flex max-w-3xl flex-wrap items-end justify-between gap-3 px-6 pt-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Rendre la pensée visible
          </h1>

          <p className="mt-1 text-stone-600">
            Routines de pensée inspirées de Project Zero (Harvard).
          </p>
        </div>

        <nav className="flex gap-2 text-sm" aria-label="Navigation principale">
          {(["form", "gallery"] as const).map((v) => (
            <button
                key={v}
                type="button"
                onClick={() => {
                  setView(v);
                  setError("");
                }}
                aria-pressed={view === v}
                className={`rounded-full px-4 py-2 ${
                  view === v 
                      ? "bg-stone-900 text-white" 
                      : "bg-white ring-1 ring-stone-300 hover:bg-stone-100"
                }`}
            >
              {v === "form" ? "Ma réflexion" : "Galerie et journal"}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-6">
        {/* Avis de confidentialité */}
        <aside
            className="mb-5 rounded-xl border border-amber-300 bg-amber-100 p-4 text-sm text-stone-800"
            role="note"
            aria-label="Avis de confidentialité" >
          <p className="font-bold">Avis de confidentialité</p>

          <p className="mt-1">
            Les réflexions soumises sont enregistrées dans le journal et peuvent
            être consultées par les autres visiteurs. Le prénom est facultatif.
            Évitez d'inclure des informations personnelles ou confidentielles
            dans vos réponses.
          </p>
        </aside>

        {view === "form" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            {/* Barre de progression */}
            {step >= 1 && step <= 4 && (
              <div className="mb-4"
                   role="progressbar"
                   aria-valuemin={1}
                   aria-valuemax={4}
                   aria-valuenow={step}
                   aria-label="Progression">
                <div className="h-2 rounded-full bg-stone-200">
                  <div
                      className="h-2 rounded-full bg-orange-500 transition-all"
                      style={{ width: `${step * 25}%` }}
                  />
                  </div>

                <p className="mt-1 text-sm text-stone-500">
                        Étape {step} sur 4
                </p>
              </div>
            )}

            {/* Étape 0 : choix de la routine et du sujet */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="mb-2 text-xl font-bold">
                    1. Choisissez une routine
                  </h2>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {(Object.keys(ROUTINES) as RoutineId[]).map((id) => (
                      <button
                          key={id}
                          type="button"
                          onClick={() => setRoutine(id)}
                          aria-pressed={routine === id}
                          className={`rounded-xl p-4 text-left ring-1 ${
                            routine === id 
                                ? "bg-orange-50 ring-2 ring-orange-500" 
                                : "ring-stone-300 hover:bg-stone-50"
                          }`}
                      >
                        <span className="font-bold">
                          {ROUTINES[id].name}
                        </span>

                        <span className="mt-1 block text-sm text-stone-600">
                          {ROUTINES[id].intro}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-bold">
                    2. Choisissez ce que vous voulez explorer
                  </h2>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {STIMULI.map((s) => (
                      <button
                          key={s.label}
                          type="button"
                          onClick={() => setStimulus(s)}
                          aria-pressed={stimulus.label === s.label}
                          className={`flex items-center gap-3 rounded-xl p-3 text-left ring-1 ${
                            stimulus.label === s.label 
                                ? "bg-orange-50 ring-2 ring-orange-500" 
                                : "ring-stone-300 hover:bg-stone-50"
                          }`}
                      >
                        <span className="text-3xl" aria-hidden="true">
                          {s.emoji}
                        </span>

                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStep(1)
                    }}
                    className="rounded-lg bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-700"
                >
                  Commencer
                </button>
              </div>
            )}

            {/* Étapes de réflexion */}
            {current && (
              <div>
                <p className="text-5xl" aria-hidden="true">
                  {stimulus.emoji}
                </p>

                <p className="mt-1 text-stone-600">{stimulus.label}</p>

                <h2 className="mt-4 text-2xl font-bold">
                  {current.title}
                </h2>

                <label
                    htmlFor="answer"
                    className="mt-1 block text-stone-600"
                >
                  {current.prompt}
                </label>

                <textarea
                    id="answer"
                    rows={5}
                    maxLength={MAX_CHARACTERS}
                    value={value}
                    placeholder={current.starter}
                    aria-describedby="answer-counter answer-validation"
                  onChange={(e) =>
                      updateAnswer(current.key, e.target.value)
                  }
                  className="mt-3 w-full rounded-lg bg-stone-100 p-3 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <p
                    id="answer-counter"
                    className={`text-sm ${ 
                      valid ? "text-green-700" : "text-orange-700" 
                    }`}
                >
                  {trimmedValue.length} / {MIN_CHARACTERS} caractères minimum
                </p>

                {!valid && (
                    <p
                        id="answer-validation"
                        className="mt-1 text-sm text-orange-700"
                        role="status"
                    >
                      {validationMessage}
                  </p>
                )}

                {error && (
                    <p className="mt-2 text-sm text-red-700" role="alert">
                      {error}
                 </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                      type="button"
                      onClick={goBack}
                      className="rounded-lg px-4 py-2 ring-1 ring-stone-300 hover:bg-stone-50"
                  >
                    Retour
                  </button>

                  <button
                      type="button"
                      onClick={continueToNextStep}
                      disabled={!valid}
                      className="rounded-lg bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}


            {/* Étape 4 : relecture */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold">
                  Relisez votre pensée
                </h2>

                <p className="mt-2 text-sm text-stone-600">
                  Vérifiez vos réponses avant de les ajouter au journal.
                </p>

                <dl className="mt-3 space-y-3">
                  {r.steps.map((s) => (
                      <div
                          key={s.key}
                          className="rounded-lg bg-stone-50 p-3"
                      >
                        <dt className="font-semibold">{s.title}</dt>

                        <dd className="mt-1 whitespace-pre-wrap text-stone-700">
                          {answers[s.key]}
                  </dd>
                  </div>
                  ))}
                </dl>

                <label
                    htmlFor="author"
                    className="mt-4 block text-sm text-stone-600"
                >
                  Votre prénom (facultatif)
                </label>

                <input
                    id="author"
                    value={author}
                    maxLength={50}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mt-1 rounded-lg bg-stone-100 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />

                {error && (
                    <p className="mt-3 text-red-700" role="alert">
                      {error}
                    </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setStep(3)
                      }}
                      className="rounded-lg px-4 py-2 ring-1 ring-stone-300 hover:bg-stone-50">
                     Modifier
                  </button>

                  <button
                      type="button"
                      onClick={submit}
                      disabled={saving}
                      className="rounded-lg bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-700 disabled:opacity-50">
                    {saving ? "Enregistrement…" : "Ajouter au journal"}
                  </button>
                </div>
              </div>
            )}

            {/* Étape 5 : confirmation */}
            {step === 5 && (
              <div className="text-center">
                <p className="text-5xl" aria-hidden="true">
                  ✅
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Votre réflexion est dans le journal
                </h2>

                <p className="mt-2 text-stone-600">
                  Merci d'avoir pris le temps de rendre votre pensée visible.
                </p>

                <div className="mt-4 flex justify-center gap-2">
                  <button
                      type="button"
                      onClick={reset}
                          className="rounded-lg bg-orange-600 px-5 py-2 font-bold text-white hover:bg-orange-700">
                    Faire une autre routine
                  </button>

                  <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setView("gallery"); }}
                          className="rounded-lg px-4 py-2 ring-1 ring-stone-300 hover:bg-stone-50"
                  >
                    Voir la galerie
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Galerie et export */}
        {view === "gallery" && (
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <label htmlFor="f" className="text-stone-600">
                Routine
              </label>

              <select
                  id="f" value={filter}
                  onChange={(e) =>
                      setFilter(e.target.value as "" | RoutineId)}
                  className="rounded-lg bg-white px-3 py-2 ring-1 ring-stone-300">

                <option value="">Toutes</option>

                  {(Object.keys(ROUTINES) as RoutineId[]).map((id) => (
                      <option key={id} value={id}>
                        {ROUTINES[id].name}
                     </option>
                ))}
              </select>

              <a href={`${API}/api/export.md`}
                 className="ml-auto rounded-lg bg-stone-900 px-4 py-2 font-semibold text-white hover:bg-stone-700">
                 Télécharger le journal (.md)
              </a>
            </div>

            {error && (
                <p className="mb-3 text-red-700" role="alert">
                  {error}
                </p>
            )}

            {items.length === 0 && !error && (
                <p className="text-stone-500">
                  Aucune réflexion pour le moment. Soyez la première personne à en
                  ajouter une.
            </p>)}

            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="rounded-xl bg-white p-4 ring-1 ring-stone-200">
                  <p className="font-bold">{it.topic}</p>

                  <p className="text-sm text-stone-500">
                    {ROUTINES[it.routine]?.name} •{" "}
                    {it.author} • {" "}
                    {new Date(it.created_at).toLocaleString("fr-CA")}
                  </p>

                  <dl className="mt-2 space-y-1">
                    {ROUTINES[it.routine]?.steps.map((s) => (
                        <div key={s.key}>
                          <dt className="inline font-semibold">
                            {s.title} :{" "}
                          </dt>

                          <dd className="inline whitespace-pre-wrap">
                            {it.answers?.[s.key] ?? ""}                      </dd>
                    </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
