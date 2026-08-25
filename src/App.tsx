import { useEffect, useMemo, useState } from "react";
import {
  areaLabels,
  courseById,
  courses,
  curriculumRules,
  electiveAreas,
  prerequisiteIds,
  semesterNumbers,
  type Course,
  type CourseArea,
} from "./curriculum-data";

type CourseStatus = "available" | "completed" | "blocked" | "waived";
type StatusFilter = "all" | CourseStatus;
type IconName =
  | "arrow"
  | "book"
  | "check"
  | "clock"
  | "close"
  | "info"
  | "layers"
  | "lock"
  | "reset"
  | "search";

const STORAGE_KEY = "curriculo-2006-progress-v2";
const LEGACY_STORAGE_KEY = "curriculo-2006-progress-v1";
const DEFAULT_ENTRY_TERM = 20141;

const entryTermOptions = Array.from({ length: 21 }, (_, index) => 2006 + index)
  .flatMap((year) => [year * 10 + 1, year * 10 + 2])
  .reverse();

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="m9 18 6-6-6-6" />,
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    reset: (
      <>
        <path d="M4 4v6h6" />
        <path d="M5.5 15a8 8 0 1 0 1-9L4 10" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

function formatEntryTerm(term: number) {
  return `${Math.floor(term / 10)}.${term % 10}`;
}

function isRequiredForEntry(course: Course, entryTerm: number) {
  return !course.requiredFrom || entryTerm >= course.requiredFrom;
}

function getInitialProgress() {
  const empty = {
    completed: [] as string[],
    electiveHours: 0,
    plan: {} as Record<string, number>,
    entryTerm: DEFAULT_ENTRY_TERM,
  };

  if (typeof window === "undefined") return empty;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!saved && !legacy) return empty;

    const parsed = JSON.parse(saved ?? legacy ?? "{}") as {
      completed?: string[];
      electiveHours?: number;
      plan?: Record<string, number>;
      entryTerm?: number;
    };
    const completed = Array.isArray(parsed.completed)
      ? parsed.completed.filter(
          (id) => Boolean(courseById[id]) && courseById[id].kind !== "bloco-optativo",
        )
      : [];
    const legacyCompleted = new Set(
      Array.isArray(parsed.completed) ? parsed.completed : [],
    );
    const inferredElectiveHours = legacyCompleted.has("OPTATIVA2")
      ? curriculumRules.electiveHours
      : legacyCompleted.has("OPTATIVA1")
        ? 360
        : 0;
    const electiveHours = Math.min(
      curriculumRules.electiveHours,
      Math.max(
        0,
        typeof parsed.electiveHours === "number"
          ? parsed.electiveHours
          : inferredElectiveHours,
      ),
    );
    const plan = Object.fromEntries(
      Object.entries(parsed.plan ?? {}).filter(
        ([id, semester]) =>
          Boolean(courseById[id]) &&
          Number.isInteger(semester) &&
          semester >= 1 &&
          semester <= 10,
      ),
    );
    const entryTerm = entryTermOptions.includes(parsed.entryTerm ?? 0)
      ? (parsed.entryTerm as number)
      : DEFAULT_ENTRY_TERM;

    return { completed, electiveHours, plan, entryTerm };
  } catch {
    return empty;
  }
}

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [electiveHours, setElectiveHours] = useState(0);
  const [entryTerm, setEntryTerm] = useState(DEFAULT_ENTRY_TERM);
  const [semesterPlan, setSemesterPlan] = useState<Record<string, number>>({});
  const [storageReady, setStorageReady] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const requiredCourses = useMemo(
    () => courses.filter((course) => isRequiredForEntry(course, entryTerm)),
    [entryTerm],
  );
  const requiredTotalHours = requiredCourses.reduce(
    (sum, course) => sum + course.hours,
    0,
  );
  const completedRegularHours = requiredCourses
    .filter(
      (course) => course.kind !== "bloco-optativo" && completed.has(course.id),
    )
    .reduce((sum, course) => sum + course.hours, 0);
  const completedHours = Math.min(
    requiredTotalHours,
    completedRegularHours + electiveHours,
  );

  const isCourseCompleted = (course: Course) => {
    if (course.id === "OPTATIVA1") return electiveHours >= 360;
    if (course.id === "OPTATIVA2") {
      return electiveHours >= curriculumRules.electiveHours;
    }
    return completed.has(course.id);
  };

  const prerequisitesMet = (course: Course) => {
    if (!course.prerequisitePaths?.length) return true;
    return course.prerequisitePaths.some((path) =>
      path.every((id) => completed.has(id)),
    );
  };

  const statusFor = (course: Course): CourseStatus => {
    if (!isRequiredForEntry(course, entryTerm)) return "waived";
    if (isCourseCompleted(course)) return "completed";
    const hoursMet = !course.requiredHours || completedHours >= course.requiredHours;
    return prerequisitesMet(course) && hoursMet ? "available" : "blocked";
  };

  useEffect(() => {
    const saved = getInitialProgress();
    setCompleted(new Set(saved.completed));
    setElectiveHours(saved.electiveHours);
    setSemesterPlan(saved.plan);
    setEntryTerm(saved.entryTerm);
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completed: [...completed],
          electiveHours,
          entryTerm,
          plan: semesterPlan,
        }),
      );
    } catch {
      // O planejador continua utilizável mesmo sem armazenamento local.
    }
  }, [completed, electiveHours, entryTerm, semesterPlan, storageReady]);

  useEffect(() => {
    if (!selectedId) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedId]);

  const plannedSemesterFor = (course: Course) =>
    semesterPlan[course.id] ?? course.semester;

  const selectedCourse = selectedId ? courseById[selectedId] : null;
  const dependentCourses = selectedCourse
    ? courses.filter((course) => prerequisiteIds(course).includes(selectedCourse.id))
    : [];

  const relatedIds = useMemo(() => {
    if (!selectedCourse) return new Set<string>();
    return new Set([
      selectedCourse.id,
      ...prerequisiteIds(selectedCourse),
      ...dependentCourses.map((course) => course.id),
    ]);
  }, [dependentCourses, selectedCourse]);

  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const matchesFilters = (course: Course) => {
    const matchesQuery =
      !normalizedQuery ||
      `${course.code} ${course.name} ${(course.equivalents ?? []).join(" ")}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedQuery);
    return matchesQuery && (filter === "all" || statusFor(course) === filter);
  };

  const completedCount = requiredCourses.filter(isCourseCompleted).length;
  const progress = Math.min(
    100,
    Math.round((completedHours / Math.max(1, requiredTotalHours)) * 100),
  );
  const availableCourses = requiredCourses
    .filter((course) => statusFor(course) === "available")
    .sort(
      (first, second) =>
        plannedSemesterFor(first) - plannedSemesterFor(second),
    );
  const blockedCount = requiredCourses.filter(
    (course) => statusFor(course) === "blocked",
  ).length;
  const waivedCount = courses.length - requiredCourses.length;

  const toggleCompleted = (course: Course) => {
    if (course.kind === "bloco-optativo" || statusFor(course) === "waived") return;
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(course.id)) next.delete(course.id);
      else next.add(course.id);
      return next;
    });
  };

  const resetProgress = () => {
    if (
      !window.confirm(
        "Limpar disciplinas concluídas, optativas integralizadas, turma de ingresso e planejamento pessoal?",
      )
    ) {
      return;
    }
    setCompleted(new Set());
    setElectiveHours(0);
    setEntryTerm(DEFAULT_ENTRY_TERM);
    setSemesterPlan({});
    setSelectedId(null);
  };

  const moveCourse = (course: Course, semester: number) => {
    setSemesterPlan((current) => {
      const next = { ...current };
      if (semester === course.semester) delete next[course.id];
      else next[course.id] = semester;
      return next;
    });
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-copy">
          <div className="eyebrow">
            <span className="eyebrow-mark" />
            Engenharia Mecânica
            <span className="eyebrow-separator">/</span>
            Matriz 2006.1
          </div>
          <h1>Seu currículo, agora navegável.</h1>
          <p>
            Marque o que já concluiu, acompanhe a carga horária real e descubra
            quais caminhos se abrem a seguir.
          </p>
        </div>

        <section className="progress-overview" aria-label="Resumo do progresso">
          <div
            className="progress-ring"
            style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}
          >
            <div>
              <strong>{progress}%</strong>
              <span>integralizado</span>
            </div>
          </div>
          <div className="progress-copy">
            <span>Sua jornada</span>
            <strong>
              {completedHours.toLocaleString("pt-BR")} <small>H/A</small>
            </strong>
            <p>
              de {requiredTotalHours.toLocaleString("pt-BR")} H/A · {completedCount}/
              {requiredCourses.length} componentes
            </p>
          </div>
        </section>
      </header>

      <section className="control-panel" aria-label="Controles do currículo">
        <label className="search-field">
          <Icon name="search" />
          <span className="sr-only">Buscar disciplina</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar código, disciplina ou equivalente"
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Limpar busca"
              className="clear-search"
              onClick={() => setQuery("")}
              type="button"
            >
              <Icon name="close" size={15} />
            </button>
          )}
        </label>

        <div className="status-filters" role="group" aria-label="Filtrar por situação">
          {(
            [
              ["all", "Todas"],
              ["available", "Disponíveis"],
              ["completed", "Concluídas"],
              ["blocked", "Bloqueadas"],
              ["waived", "Dispensadas"],
            ] as const
          ).map(([value, label]) => (
            <button
              aria-pressed={filter === value}
              className={filter === value ? "active" : ""}
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <label className="entry-control">
          <span>Ingresso</span>
          <select
            aria-label="Semestre de ingresso no curso"
            onChange={(event) => setEntryTerm(Number(event.target.value))}
            value={entryTerm}
          >
            {entryTermOptions.map((term) => (
              <option key={term} value={term}>
                {formatEntryTerm(term)}
              </option>
            ))}
          </select>
        </label>

        <label className="elective-control">
          <span>
            <small>Optativas integralizadas</small>
            <strong>{electiveHours} / {curriculumRules.electiveHours} H/A</strong>
          </span>
          <input
            aria-label="Horas-aula de optativas já integralizadas"
            max={curriculumRules.electiveHours}
            min="0"
            onChange={(event) =>
              setElectiveHours(
                Math.min(
                  curriculumRules.electiveHours,
                  Math.max(0, Number(event.target.value)),
                ),
              )
            }
            step="18"
            type="number"
            value={electiveHours}
          />
        </label>

        <button className="reset-button" onClick={resetProgress} type="button">
          <Icon name="reset" size={17} />
          Limpar
        </button>
      </section>

      <section className="status-strip" aria-label="Situação atual">
        <div className="strip-title">
          <span className="pulse-dot" />
          <div>
            <small>Próximos passos</small>
            <strong>
              {availableCourses.length} {availableCourses.length === 1
                ? "componente disponível"
                : "componentes disponíveis"}
            </strong>
          </div>
        </div>
        <div className="next-courses">
          {availableCourses.slice(0, 4).map((course) => (
            <button key={course.id} onClick={() => setSelectedId(course.id)} type="button">
              <span>{course.code}</span>
              {course.name}
              <Icon name="arrow" size={15} />
            </button>
          ))}
        </div>
        <div className="strip-stat">
          <span>{blockedCount}</span>
          <small>ainda bloqueados</small>
        </div>
      </section>

      <section className="official-summary" aria-label="Regras principais do currículo">
        <div>
          <small>Carga do currículo</small>
          <strong>{requiredTotalHours.toLocaleString("pt-BR")} H/A</strong>
          <span>{curriculumRules.cneHours.toLocaleString("pt-BR")} horas CNE</span>
        </div>
        <div>
          <small>Optativas profissionais</small>
          <strong>{curriculumRules.electiveHours} H/A</strong>
          <span>até {curriculumRules.specialBlockLimit} H/A do Bloco Especial</span>
        </div>
        <div>
          <small>Prazo de conclusão</small>
          <strong>{curriculumRules.minimumSemesters}-{curriculumRules.maximumSemesters} semestres</strong>
          <span>{curriculumRules.minimumWeeklyClasses}-{curriculumRules.maximumWeeklyClasses} aulas semanais</span>
        </div>
        <div className={waivedCount ? "cohort-rule is-active" : "cohort-rule"}>
          <small>Regra da sua turma</small>
          <strong>{waivedCount ? `${waivedCount} dispensa aplicada` : "Matriz completa"}</strong>
          <span>
            {entryTerm < 20141
              ? "EMC5443 não é obrigatória para este ingresso"
              : "EMC5443 obrigatória desde 2014.1"}
          </span>
        </div>
      </section>

      <section className="map-section" aria-labelledby="map-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Mapa curricular oficial</span>
            <h2 id="map-title">Percorra as 10 fases</h2>
          </div>
          <div className="map-hint">
            <Icon name="layers" size={17} />
            Role para o lado e selecione uma disciplina para ver carga, conteúdo,
            equivalências e conexões.
          </div>
        </div>

        <div className="semester-board">
          {semesterNumbers.map((semester) => {
            const semesterCourses = courses.filter(
              (course) =>
                plannedSemesterFor(course) === semester && matchesFilters(course),
            );
            const totalInSemester = courses.filter(
              (course) =>
                plannedSemesterFor(course) === semester &&
                isRequiredForEntry(course, entryTerm),
            ).length;
            const completedInSemester = courses.filter(
              (course) =>
                plannedSemesterFor(course) === semester &&
                isRequiredForEntry(course, entryTerm) &&
                isCourseCompleted(course),
            ).length;
            const phaseHours = courses
              .filter(
                (course) =>
                  plannedSemesterFor(course) === semester &&
                  isRequiredForEntry(course, entryTerm),
              )
              .reduce((sum, course) => sum + course.hours, 0);

            return (
              <section className="semester-column" key={semester}>
                <header>
                  <div className="semester-number">{String(semester).padStart(2, "0")}</div>
                  <div>
                    <h3>{semester}ª fase</h3>
                    <span>{completedInSemester}/{totalInSemester} · {phaseHours} H/A</span>
                  </div>
                  <div className="semester-progress" aria-hidden="true">
                    <span
                      style={{
                        width: `${totalInSemester
                          ? (completedInSemester / totalInSemester) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                </header>

                <div className="course-list">
                  {semesterCourses.map((course) => {
                    const status = statusFor(course);
                    const isSelected = selectedId === course.id;
                    const isMuted = Boolean(selectedCourse) && !relatedIds.has(course.id);
                    const requirementCount = prerequisiteIds(course).length +
                      (course.requiredHours ? 1 : 0);

                    return (
                      <article
                        aria-label={`Abrir detalhes de ${course.name}`}
                        className={`course-card status-${status}${
                          isSelected ? " is-selected" : ""
                        }${isMuted ? " is-muted" : ""}`}
                        data-area={course.area}
                        key={course.id}
                        onClick={() => setSelectedId(course.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(course.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="course-card-topline">
                          <span className="course-code">{course.code}</span>
                          {course.kind === "bloco-optativo" ? (
                            <span className="block-progress">
                              {course.id === "OPTATIVA1"
                                ? Math.min(360, electiveHours)
                                : Math.max(0, electiveHours - 360)}
                              /{course.hours}
                            </span>
                          ) : (
                            <button
                              aria-label={
                                status === "completed"
                                  ? `Marcar ${course.name} como não concluída`
                                  : `Marcar ${course.name} como concluída`
                              }
                              aria-pressed={status === "completed"}
                              className="completion-toggle"
                              disabled={status === "waived"}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleCompleted(course);
                              }}
                              type="button"
                            >
                              {status === "completed" ? (
                                <Icon name="check" size={15} />
                              ) : status === "blocked" ? (
                                <Icon name="lock" size={13} />
                              ) : status === "waived" ? (
                                <span className="waived-mark">-</span>
                              ) : (
                                <span />
                              )}
                            </button>
                          )}
                        </div>
                        <h4>{course.name}</h4>
                        <div className="course-card-footer">
                          <span className="area-dot" />
                          {course.hours} H/A
                          {status === "waived" ? (
                            <span className="requirement-count">dispensada</span>
                          ) : requirementCount ? (
                            <span className="requirement-count">
                              {course.requiredHours
                                ? `${course.requiredHours} H/A mín.`
                                : `${requirementCount} requisito${requirementCount > 1 ? "s" : ""}`}
                            </span>
                          ) : null}
                          {plannedSemesterFor(course) !== course.semester && (
                            <span className="moved-badge">replanejada</span>
                          )}
                        </div>
                      </article>
                    );
                  })}

                  {!semesterCourses.length && (
                    <div className="empty-column">Nenhuma disciplina neste filtro.</div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="legend" aria-label="Legenda de áreas">
        <span className="legend-label">Áreas</span>
        {(Object.entries(areaLabels) as [CourseArea, string][]).map(([area, label]) => (
          <span className="legend-item" data-area={area} key={area}>
            <i /> {label}
          </span>
        ))}
      </section>

      <section className="electives-section" aria-labelledby="electives-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">576 H/A obrigatórias</span>
            <h2 id="electives-title">Caminhos de optativas</h2>
          </div>
          <p>
            O catálogo oficial organiza as escolhas por área. A validação final depende
            do histórico e das regras acadêmicas vigentes.
          </p>
        </div>
        <div className="elective-grid">
          {electiveAreas.map((area) => (
            <article key={area.id}>
              <span>{area.label}</span>
              <p>{area.description}</p>
              <ul>
                {area.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="integralization-note">
          <Icon name="info" size={18} />
          <p>
            Podem ser contabilizadas até <strong>{curriculumRules.specialBlockLimit} H/A</strong>
            {" "}do Bloco Especial e até <strong>{curriculumRules.extraCourseLimit} H/A</strong>
            {" "}de disciplinas extracurso. Educação Física Curricular não conta para a
            integralização desta matriz.
          </p>
        </div>
      </section>

      {selectedCourse && (
        <>
          <button
            aria-label="Fechar detalhes da disciplina"
            className="drawer-backdrop"
            onClick={() => setSelectedId(null)}
            type="button"
          />
          <aside
            className="course-drawer"
            aria-label="Detalhes da disciplina"
            key={selectedCourse.id}
          >
            <header>
              <span>Detalhes oficiais</span>
              <button
                aria-label="Fechar detalhes"
                onClick={() => setSelectedId(null)}
                type="button"
              >
                <Icon name="close" size={18} />
              </button>
            </header>

            <div className="drawer-body">
              <div className="drawer-course-heading" data-area={selectedCourse.area}>
                <span className="drawer-area">{areaLabels[selectedCourse.area]}</span>
                <span className={`drawer-status status-${statusFor(selectedCourse)}`}>
                  {statusFor(selectedCourse) === "completed"
                    ? "Concluída"
                    : statusFor(selectedCourse) === "available"
                      ? "Disponível"
                      : statusFor(selectedCourse) === "waived"
                        ? "Dispensada"
                        : "Bloqueada"}
                </span>
                <strong>{selectedCourse.code}</strong>
                <h2>{selectedCourse.name}</h2>
                <p>
                  {selectedCourse.hours} H/A · {selectedCourse.weeklyClasses} aulas
                  semanais · {selectedCourse.semester}ª fase
                </p>
              </div>

              {selectedCourse.kind === "bloco-optativo" ? (
                <div className="elective-progress-editor">
                  <label htmlFor="drawer-elective-hours">
                    Optativas já integralizadas
                    <strong>{electiveHours} / {curriculumRules.electiveHours} H/A</strong>
                  </label>
                  <input
                    id="drawer-elective-hours"
                    max={curriculumRules.electiveHours}
                    min="0"
                    onChange={(event) => setElectiveHours(Number(event.target.value))}
                    step="18"
                    type="range"
                    value={electiveHours}
                  />
                  <p>Use o total que já aparece integralizado no seu histórico.</p>
                </div>
              ) : statusFor(selectedCourse) === "waived" ? (
                <div className="waived-notice">
                  <Icon name="info" size={18} />
                  <span>
                    Esta disciplina não é obrigatória para ingresso em {formatEntryTerm(entryTerm)}.
                  </span>
                </div>
              ) : (
                <button
                  className={`primary-action ${
                    completed.has(selectedCourse.id) ? "is-completed" : ""
                  }`}
                  onClick={() => toggleCompleted(selectedCourse)}
                  type="button"
                >
                  <Icon name="check" size={18} />
                  {completed.has(selectedCourse.id)
                    ? "Marcar como não concluída"
                    : "Marcar como concluída"}
                </button>
              )}

              <div className="drawer-section plan-editor">
                <div className="drawer-section-title">
                  <span>Seu planejamento</span>
                  <small><Icon name="layers" size={13} /></small>
                </div>
                <p>
                  Reorganize o componente no seu plano. Os requisitos oficiais não mudam.
                </p>
                <label>
                  <span>Fase planejada</span>
                  <select
                    onChange={(event) =>
                      moveCourse(selectedCourse, Number(event.target.value))
                    }
                    value={plannedSemesterFor(selectedCourse)}
                  >
                    {semesterNumbers.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}ª fase
                      </option>
                    ))}
                  </select>
                </label>
                {plannedSemesterFor(selectedCourse) !== selectedCourse.semester && (
                  <div className="plan-change-note">
                    <span>Matriz original: {selectedCourse.semester}ª fase</span>
                    <button
                      onClick={() => moveCourse(selectedCourse, selectedCourse.semester)}
                      type="button"
                    >
                      Restaurar posição
                    </button>
                  </div>
                )}
              </div>

              <div className="drawer-section syllabus-section">
                <div className="drawer-section-title">
                  <span>Conteúdo da disciplina</span>
                  <small><Icon name="book" size={13} /></small>
                </div>
                <p>{selectedCourse.syllabus}</p>
              </div>

              {selectedCourse.equivalents?.length ? (
                <div className="drawer-section">
                  <div className="drawer-section-title">
                    <span>Equivalências</span>
                    <small>{selectedCourse.equivalents.length}</small>
                  </div>
                  <div className="equivalence-list">
                    {selectedCourse.equivalents.map((equivalent) => (
                      <span key={equivalent}>{equivalent}</span>
                    ))}
                  </div>
                  <p className="equivalence-help">
                    Se você concluiu uma equivalência reconhecida, marque este componente
                    como concluído.
                  </p>
                </div>
              ) : null}

              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Pré-requisitos</span>
                  <small>
                    {prerequisiteIds(selectedCourse).length +
                      (selectedCourse.requiredHours ? 1 : 0)}
                  </small>
                </div>

                {!selectedCourse.prerequisitePaths?.length &&
                !selectedCourse.requiredHours ? (
                  <p className="no-requirements">Esta disciplina não tem pré-requisitos.</p>
                ) : (
                  <div className="requirement-paths">
                    {selectedCourse.prerequisitePaths?.map((path, pathIndex) => (
                      <div className="requirement-path" key={`${selectedCourse.id}-${pathIndex}`}>
                        {selectedCourse.prerequisitePaths!.length > 1 && (
                          <span className="path-label">
                            {pathIndex ? "OU caminho alternativo" : "Caminho principal"}
                          </span>
                        )}
                        <div className="relationship-list">
                          {path.map((id) => {
                            const prerequisite = courseById[id];
                            return (
                              <button
                                key={`${pathIndex}-${id}`}
                                onClick={() => setSelectedId(id)}
                                type="button"
                              >
                                <span
                                  className={`relationship-check ${
                                    completed.has(id) ? "done" : "pending"
                                  }`}
                                >
                                  {completed.has(id) ? (
                                    <Icon name="check" size={14} />
                                  ) : (
                                    <Icon name="lock" size={12} />
                                  )}
                                </span>
                                <span>
                                  <small>{prerequisite.code}</small>
                                  <strong>{prerequisite.name}</strong>
                                </span>
                                <Icon name="arrow" size={16} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {selectedCourse.requiredHours && (
                      <div className="hours-requirement">
                        <span
                          className={`relationship-check ${
                            completedHours >= selectedCourse.requiredHours
                              ? "done"
                              : "pending"
                          }`}
                        >
                          {completedHours >= selectedCourse.requiredHours ? (
                            <Icon name="check" size={14} />
                          ) : (
                            <Icon name="clock" size={13} />
                          )}
                        </span>
                        <span>
                          <small>Carga horária mínima</small>
                          <strong>
                            {selectedCourse.requiredHours.toLocaleString("pt-BR")} H/A
                          </strong>
                        </span>
                      </div>
                    )}
                    {selectedCourse.prerequisiteText && (
                      <p className="official-requirement-text">
                        {selectedCourse.prerequisiteText}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Este componente libera</span>
                  <small>{dependentCourses.length}</small>
                </div>
                {dependentCourses.length ? (
                  <div className="unlock-list">
                    {dependentCourses.map((course) => (
                      <button
                        data-area={course.area}
                        key={course.id}
                        onClick={() => setSelectedId(course.id)}
                        type="button"
                      >
                        <i />
                        <span><small>{course.code}</small>{course.name}</span>
                        <Icon name="arrow" size={16} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="no-requirements">
                    Nenhuma dependência direta aparece nesta matriz.
                  </p>
                )}
              </div>

              {selectedCourse.sourceNote && (
                <div className="source-note">
                  <strong>Observação da conferência</strong>
                  <p>{selectedCourse.sourceNote}</p>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      <footer className="site-footer">
        <p>
          Base de dados: Currículo do Curso 20061, SeTIC/PROGRAD, extraído em
          {" "}{curriculumRules.sourceDate}. Ferramenta estudantil independente:
          confirme matrícula, equivalências e integralização no CAGR.
        </p>
        <span>49 componentes codificados · 576 H/A optativas · 10 fases</span>
      </footer>
    </main>
  );
}
