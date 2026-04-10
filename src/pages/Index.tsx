import { useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "candidates", label: "Кандидаты", icon: "Users" },
  { id: "vacancies", label: "Вакансии", icon: "Briefcase" },
  { id: "interviews", label: "Интервью", icon: "CalendarCheck" },
  { id: "analytics", label: "Аналитика", icon: "BarChart3" },
  { id: "messages", label: "Сообщения", icon: "MessageSquare" },
  { id: "team", label: "Команда", icon: "UsersRound" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

const CANDIDATES = [
  { id: 1, name: "Алексей Воронов", role: "Senior Frontend Developer", exp: 6, salary: 280000, skills: ["React", "TypeScript", "Node.js"], status: "Интервью", avatar: "АВ", score: 92 },
  { id: 2, name: "Мария Соколова", role: "Product Manager", exp: 4, salary: 210000, skills: ["Agile", "Figma", "Analytics"], status: "Оффер", avatar: "МС", score: 88 },
  { id: 3, name: "Дмитрий Ким", role: "Data Scientist", exp: 3, salary: 195000, skills: ["Python", "ML", "SQL"], status: "Скрининг", avatar: "ДК", score: 75 },
  { id: 4, name: "Екатерина Белова", role: "UX Designer", exp: 5, salary: 165000, skills: ["Figma", "UX Research", "Prototyping"], status: "Отказ", avatar: "ЕБ", score: 61 },
  { id: 5, name: "Иван Петров", role: "Backend Developer", exp: 7, salary: 310000, skills: ["Go", "PostgreSQL", "Docker"], status: "Интервью", avatar: "ИП", score: 95 },
  { id: 6, name: "Анна Захарова", role: "Marketing Lead", exp: 2, salary: 140000, skills: ["SEO", "Content", "Google Ads"], status: "Скрининг", avatar: "АЗ", score: 70 },
];

const VACANCIES = [
  { id: 1, title: "Senior Frontend Developer", dept: "Разработка", candidates: 24, deadline: "20 апр", priority: "Высокий" },
  { id: 2, title: "Product Manager", dept: "Продукт", candidates: 17, deadline: "25 апр", priority: "Средний" },
  { id: 3, title: "Data Scientist", dept: "Аналитика", candidates: 9, deadline: "30 апр", priority: "Высокий" },
  { id: 4, title: "UX/UI Designer", dept: "Дизайн", candidates: 31, deadline: "15 мая", priority: "Низкий" },
];

const INTERVIEWS = [
  { id: 1, candidate: "Иван Петров", role: "Backend Developer", time: "Сегодня, 14:00", type: "Техническое", interviewer: "А. Громов" },
  { id: 2, candidate: "Алексей Воронов", role: "Frontend Developer", time: "Сегодня, 16:30", type: "Финальное", interviewer: "Е. Смирнова" },
  { id: 3, candidate: "Мария Соколова", role: "Product Manager", time: "Завтра, 11:00", type: "HR-собеседование", interviewer: "О. Лебедева" },
  { id: 4, candidate: "Дмитрий Ким", role: "Data Scientist", time: "12 апр, 13:00", type: "Техническое", interviewer: "П. Носов" },
];

const SKILLS_OPTIONS = ["React", "TypeScript", "Python", "Go", "SQL", "Figma", "Node.js", "ML", "Docker", "Agile"];
const STATUS_OPTIONS = ["Все статусы", "Скрининг", "Интервью", "Оффер", "Отказ"];

const statusColors: Record<string, string> = {
  "Интервью": "bg-blue-100 text-blue-700",
  "Оффер": "bg-emerald-100 text-emerald-700",
  "Скрининг": "bg-amber-100 text-amber-700",
  "Отказ": "bg-red-100 text-red-600",
};

const priorityColors: Record<string, string> = {
  "Высокий": "bg-red-50 text-red-600",
  "Средний": "bg-amber-50 text-amber-600",
  "Низкий": "bg-slate-100 text-slate-500",
};

const avatarColors = [
  "bg-blue-600", "bg-violet-600", "bg-emerald-600",
  "bg-rose-600", "bg-indigo-600", "bg-teal-600",
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [expRange, setExpRange] = useState<[number, number]>([0, 10]);
  const [salaryMax, setSalaryMax] = useState(400000);
  const [statusFilter, setStatusFilter] = useState("Все статусы");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filteredCandidates = CANDIDATES.filter(c => {
    const matchSkill = selectedSkills.length === 0 || selectedSkills.some(s => c.skills.includes(s));
    const matchExp = c.exp >= expRange[0] && c.exp <= expRange[1];
    const matchSalary = c.salary <= salaryMax;
    const matchStatus = statusFilter === "Все статусы" || c.status === statusFilter;
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSkill && matchExp && matchSalary && matchStatus && matchSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f1f5f9", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 shrink-0"
        style={{
          width: sidebarCollapsed ? 64 : 228,
          background: "#1a2d5a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: "#f59e0b", color: "#1a2d5a" }}>
            TF
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-sm tracking-tight text-white">TalentFlow</span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto p-1 rounded opacity-30 hover:opacity-70 transition-opacity text-white"
          >
            <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 text-left"
              style={{
                background: activeSection === item.id ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeSection === item.id ? "white" : "rgba(255,255,255,0.5)",
                borderLeft: activeSection === item.id ? "2px solid #f59e0b" : "2px solid transparent",
              }}
            >
              <Icon name={item.icon} size={16} className="shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!sidebarCollapsed && item.id === "messages" && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#f59e0b", color: "#1a2d5a" }}>3</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#f59e0b", color: "#1a2d5a" }}>
                ЕС
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate text-white">Елена Сергеева</div>
                <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>HR Director</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-3 shrink-0" style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}>
          <div>
            <h1 className="font-semibold text-sm" style={{ color: "#0f172a" }}>
              {NAV_ITEMS.find(n => n.id === activeSection)?.label}
            </h1>
            <p className="text-xs" style={{ color: "#94a3b8" }}>10 апреля 2026</p>
          </div>
          <div className="flex-1 max-w-xs ml-4">
            <div className="relative">
              <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Поиск кандидатов..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-lg outline-none"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Icon name="Bell" size={17} style={{ color: "#64748b" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f59e0b" }}></span>
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Icon name="HelpCircle" size={17} style={{ color: "#64748b" }} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1" style={{ background: "#1a2d5a", color: "white" }}>
              ЕС
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {activeSection === "dashboard" && <DashboardView onNavigate={setActiveSection} />}
          {activeSection === "candidates" && (
            <CandidatesView
              candidates={filteredCandidates}
              allCandidates={CANDIDATES}
              selectedSkills={selectedSkills}
              onToggleSkill={toggleSkill}
              expRange={expRange}
              setExpRange={setExpRange}
              salaryMax={salaryMax}
              setSalaryMax={setSalaryMax}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
          {activeSection === "vacancies" && <VacanciesView />}
          {activeSection === "interviews" && <InterviewsView />}
          {activeSection === "analytics" && <AnalyticsView />}
          {(activeSection === "messages" || activeSection === "team" || activeSection === "settings") && (
            <PlaceholderView section={activeSection} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */
function DashboardView({ onNavigate }: { onNavigate: (s: string) => void }) {
  const metrics = [
    { label: "Активных вакансий", value: "24", trend: "+3 за неделю", icon: "Briefcase", color: "#2563eb" },
    { label: "Кандидатов в работе", value: "138", trend: "+12 за неделю", icon: "Users", color: "#7c3aed" },
    { label: "Интервью на неделе", value: "17", trend: "5 сегодня", icon: "CalendarCheck", color: "#059669" },
    { label: "Офферов выдано", value: "6", trend: "2 принято", icon: "Award", color: "#d97706" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={m.label}
            className={`animate-fade-in stagger-${i + 1} rounded-xl p-5 transition-all hover:-translate-y-0.5 cursor-default`}
            style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: m.color + "18" }}>
                <Icon name={m.icon} size={18} style={{ color: m.color }} />
              </div>
              <Icon name="TrendingUp" size={13} style={{ color: "#10b981" }} />
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
            <div className="text-xs font-medium mb-0.5" style={{ color: "#475569" }}>{m.label}</div>
            <div className="text-xs" style={{ color: "#94a3b8" }}>{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Funnel */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Воронка подбора</h2>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0" }}>Этот месяц</span>
          </div>
          <div className="space-y-3.5">
            {[
              { stage: "Отклики", count: 248, pct: 100, color: "#2563eb" },
              { stage: "Скрининг", count: 142, pct: 57, color: "#7c3aed" },
              { stage: "Интервью", count: 67, pct: 27, color: "#f59e0b" },
              { stage: "Тестовое", count: 34, pct: 14, color: "#059669" },
              { stage: "Оффер", count: 12, pct: 5, color: "#10b981" },
            ].map((f, i) => (
              <div key={f.stage} className={`animate-fade-in stagger-${i + 1}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: "#475569" }}>{f.stage}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: "#0f172a" }}>{f.count}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#f1f5f9" }}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${f.pct}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Interviews */}
        <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#0f172a" }}>Интервью сегодня</h2>
          <div className="space-y-3">
            {INTERVIEWS.slice(0, 2).map((iv, i) => (
              <div key={iv.id} className={`animate-fade-in stagger-${i + 1} p-3 rounded-lg`} style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColors[i]}`}>
                    {iv.candidate.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="text-xs font-semibold truncate" style={{ color: "#0f172a" }}>{iv.candidate}</span>
                </div>
                <div className="text-xs mb-1.5" style={{ color: "#94a3b8" }}>{iv.role}</div>
                <div className="flex items-center gap-1.5">
                  <Icon name="Clock" size={11} style={{ color: "#f59e0b" }} />
                  <span className="text-xs font-semibold" style={{ color: "#f59e0b" }}>{iv.time.replace("Сегодня, ", "")}</span>
                </div>
              </div>
            ))}
            <button
              onClick={() => onNavigate("interviews")}
              className="w-full text-xs py-2 rounded-lg font-semibold transition-opacity hover:opacity-80"
              style={{ background: "#1a2d5a", color: "white" }}>
              Все интервью
            </button>
          </div>
        </div>
      </div>

      {/* Recent candidates table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#e2e8f0" }}>
          <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Последние кандидаты</h2>
          <button onClick={() => onNavigate("candidates")} className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "#1a2d5a" }}>
            Все кандидаты →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Кандидат", "Должность", "Навыки", "Опыт", "Зарплата", "Статус", "Рейтинг"].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.slice(0, 4).map((c, i) => (
              <tr key={c.id}
                className={`animate-fade-in stagger-${i + 1} transition-colors hover:bg-slate-50 cursor-pointer`}
                style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColors[i]}`}>
                      {c.avatar}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#0f172a" }}>{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{c.role}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {c.skills.slice(0, 2).map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ background: "#f1f5f9", color: "#475569" }}>{s}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "#475569" }}>{c.exp} лет</td>
                <td className="px-5 py-3.5 text-xs font-mono font-medium" style={{ color: "#0f172a" }}>{c.salary.toLocaleString("ru")} ₽</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full" style={{ background: "#f1f5f9" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${c.score}%`, background: c.score >= 85 ? "#10b981" : c.score >= 70 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                    <span className="text-xs font-mono font-bold w-6 text-right" style={{ color: "#0f172a" }}>{c.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Candidates ─── */
interface CandidatesViewProps {
  candidates: typeof CANDIDATES;
  allCandidates: typeof CANDIDATES;
  selectedSkills: string[];
  onToggleSkill: (s: string) => void;
  expRange: [number, number];
  setExpRange: (r: [number, number]) => void;
  salaryMax: number;
  setSalaryMax: (v: number) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
}

function CandidatesView({ candidates, allCandidates, selectedSkills, onToggleSkill, expRange, setExpRange, salaryMax, setSalaryMax, statusFilter, setStatusFilter, searchQuery, setSearchQuery }: CandidatesViewProps) {
  return (
    <div className="flex gap-5 animate-fade-in">
      {/* Filters */}
      <aside className="w-56 shrink-0 space-y-4">
        <div className="rounded-xl p-4" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#94a3b8" }}>Поиск</h3>
          <div className="relative">
            <Icon name="Search" size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Имя или должность..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg outline-none"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
            />
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#94a3b8" }}>Статус</h3>
          <div className="space-y-1">
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={{
                  background: statusFilter === s ? "#1a2d5a" : "transparent",
                  color: statusFilter === s ? "white" : "#475569",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#94a3b8" }}>Навыки</h3>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS_OPTIONS.map(skill => (
              <button key={skill} onClick={() => onToggleSkill(skill)}
                className="text-xs px-2 py-0.5 rounded-md transition-all"
                style={{
                  background: selectedSkills.includes(skill) ? "#1a2d5a" : "#f8fafc",
                  color: selectedSkills.includes(skill) ? "white" : "#475569",
                  border: `1px solid ${selectedSkills.includes(skill) ? "#1a2d5a" : "#e2e8f0"}`,
                }}>
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#94a3b8" }}>Опыт (лет)</h3>
          <div className="flex items-center gap-2">
            <input type="number" min={0} max={10} value={expRange[0]} onChange={e => setExpRange([+e.target.value, expRange[1]])}
              className="w-12 text-center text-xs py-1 rounded-md outline-none" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
            <span className="text-xs" style={{ color: "#94a3b8" }}>–</span>
            <input type="number" min={0} max={10} value={expRange[1]} onChange={e => setExpRange([expRange[0], +e.target.value])}
              className="w-12 text-center text-xs py-1 rounded-md outline-none" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
            <span className="text-xs" style={{ color: "#94a3b8" }}>лет</span>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>Макс. зарплата</h3>
          <div className="text-sm font-bold mb-2 font-mono" style={{ color: "#0f172a" }}>{salaryMax.toLocaleString("ru")} ₽</div>
          <input type="range" min={50000} max={500000} step={10000} value={salaryMax} onChange={e => setSalaryMax(+e.target.value)}
            className="w-full cursor-pointer accent-blue-700" />
          <div className="flex justify-between text-xs mt-1" style={{ color: "#94a3b8" }}>
            <span>50K</span><span>500K</span>
          </div>
        </div>
      </aside>

      {/* Candidate list */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>
            Кандидаты <span className="font-normal ml-1" style={{ color: "#94a3b8" }}>({candidates.length} из {allCandidates.length})</span>
          </h2>
          <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity" style={{ background: "#1a2d5a", color: "white" }}>
            <Icon name="UserPlus" size={13} />
            Добавить
          </button>
        </div>

        {candidates.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <Icon name="SearchX" size={28} className="mx-auto mb-3" style={{ color: "#cbd5e1" }} />
            <p className="text-sm" style={{ color: "#94a3b8" }}>Кандидаты не найдены. Измените фильтры.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {candidates.map((c: typeof CANDIDATES[0], i: number) => (
              <div key={c.id}
                className={`animate-fade-in stagger-${Math.min(i + 1, 6)} rounded-xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer`}
                style={{ background: "white", border: "1px solid #e2e8f0" }}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: "#0f172a" }}>{c.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status]}`}>{c.status}</span>
                  </div>
                  <div className="text-xs mb-1.5" style={{ color: "#64748b" }}>{c.role}</div>
                  <div className="flex gap-1 flex-wrap">
                    {c.skills.map((s: string) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ background: "#f1f5f9", color: "#475569" }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="text-sm font-bold font-mono" style={{ color: "#0f172a" }}>{c.salary.toLocaleString("ru")} ₽</div>
                  <div className="text-xs" style={{ color: "#94a3b8" }}>{c.exp} лет опыта</div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-16 h-1.5 rounded-full" style={{ background: "#f1f5f9" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${c.score}%`, background: c.score >= 85 ? "#10b981" : c.score >= 70 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: "#0f172a" }}>{c.score}</span>
                  </div>
                </div>
                <div className="flex gap-1 ml-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <Icon name="Phone" size={13} style={{ color: "#94a3b8" }} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <Icon name="Mail" size={13} style={{ color: "#94a3b8" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Vacancies ─── */
function VacanciesView() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Активные вакансии</h2>
        <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity" style={{ background: "#1a2d5a", color: "white" }}>
          <Icon name="Plus" size={13} />
          Новая вакансия
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {VACANCIES.map((v, i) => (
          <div key={v.id}
            className={`animate-fade-in stagger-${i + 1} rounded-xl p-5 transition-all hover:-translate-y-0.5 cursor-pointer`}
            style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm mb-0.5" style={{ color: "#0f172a" }}>{v.title}</h3>
                <span className="text-xs" style={{ color: "#94a3b8" }}>{v.dept}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[v.priority]}`}>{v.priority}</span>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
              <div className="flex items-center gap-1">
                <Icon name="Users" size={12} style={{ color: "#94a3b8" }} />
                <span className="text-xs" style={{ color: "#475569" }}>{v.candidates} кандидатов</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={12} style={{ color: "#94a3b8" }} />
                <span className="text-xs" style={{ color: "#475569" }}>до {v.deadline}</span>
              </div>
              <button className="ml-auto text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "#1a2d5a" }}>
                Открыть →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Interviews ─── */
function InterviewsView() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Запланированные интервью</h2>
        <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity" style={{ background: "#1a2d5a", color: "white" }}>
          <Icon name="Plus" size={13} />
          Запланировать
        </button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #e2e8f0" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Кандидат", "Должность", "Дата и время", "Тип", "Интервьюер", ""].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INTERVIEWS.map((iv, i) => (
              <tr key={iv.id}
                className={`animate-fade-in stagger-${i + 1} transition-colors hover:bg-slate-50 cursor-pointer`}
                style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColors[i]}`}>
                      {iv.candidate.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#0f172a" }}>{iv.candidate}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{iv.role}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-semibold" style={{ color: iv.time.startsWith("Сегодня") ? "#f59e0b" : "#475569" }}>{iv.time}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#f1f5f9", color: "#475569" }}>{iv.type}</span>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{iv.interviewer}</td>
                <td className="px-5 py-3.5">
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity" style={{ background: "#1a2d5a", color: "white" }}>Открыть</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Analytics ─── */
function AnalyticsView() {
  const bars = [
    { month: "Ноя", hired: 8, rejected: 24 },
    { month: "Дек", hired: 11, rejected: 19 },
    { month: "Янв", hired: 6, rejected: 31 },
    { month: "Фев", hired: 14, rejected: 22 },
    { month: "Мар", hired: 9, rejected: 28 },
    { month: "Апр", hired: 12, rejected: 17 },
  ];
  const maxVal = 55;

  return (
    <div className="animate-fade-in space-y-5">
      <h2 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Аналитика подбора</h2>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Среднее время найма", value: "23 дня", sub: "-2 дня к прошлому месяцу", icon: "Clock", color: "#2563eb" },
          { label: "Конверсия офферов", value: "68%", sub: "+5% к прошлому месяцу", icon: "TrendingUp", color: "#059669" },
          { label: "Стоимость найма", value: "42 500 ₽", sub: "на одного кандидата", icon: "Wallet", color: "#d97706" },
        ].map((m, i) => (
          <div key={m.label} className={`animate-fade-in stagger-${i + 1} rounded-xl p-5`} style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: m.color + "18" }}>
                <Icon name={m.icon} size={17} style={{ color: m.color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>{m.label}</span>
            </div>
            <div className="text-xl font-bold mb-0.5" style={{ color: "#0f172a" }}>{m.value}</div>
            <div className="text-xs" style={{ color: "#94a3b8" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
        <h3 className="font-semibold text-sm mb-5" style={{ color: "#0f172a" }}>Найм по месяцам</h3>
        <div className="flex items-end gap-5 h-36 px-2">
          {bars.map((b) => (
            <div key={b.month} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex gap-1 items-end" style={{ height: 120 }}>
                <div className="flex-1 rounded-t-md transition-all duration-700" style={{ height: `${(b.hired / maxVal) * 100}%`, background: "#1a2d5a" }} />
                <div className="flex-1 rounded-t-md transition-all duration-700" style={{ height: `${(b.rejected / maxVal) * 100}%`, background: "#e2e8f0" }} />
              </div>
              <span className="text-xs" style={{ color: "#94a3b8" }}>{b.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: "#1a2d5a" }} /><span className="text-xs" style={{ color: "#94a3b8" }}>Нанято</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: "#e2e8f0" }} /><span className="text-xs" style={{ color: "#94a3b8" }}>Отказано</span></div>
        </div>
      </div>
    </div>
  );
}

/* ─── Placeholder ─── */
function PlaceholderView({ section }: { section: string }) {
  const labels: Record<string, { icon: string; title: string; desc: string }> = {
    messages: { icon: "MessageSquare", title: "Сообщения", desc: "Чат с кандидатами и командой" },
    team: { icon: "UsersRound", title: "Команда", desc: "Управление рекрутерами и HR-специалистами" },
    settings: { icon: "Settings", title: "Настройки", desc: "Конфигурация системы и профиля" },
  };
  const item = labels[section];
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-80 rounded-xl" style={{ background: "white", border: "1px solid #e2e8f0" }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#f1f5f9" }}>
        <Icon name={item.icon} size={26} style={{ color: "#94a3b8" }} />
      </div>
      <h2 className="font-semibold mb-1.5" style={{ color: "#0f172a" }}>{item.title}</h2>
      <p className="text-sm" style={{ color: "#94a3b8" }}>{item.desc}</p>
      <p className="text-xs mt-1" style={{ color: "#cbd5e1" }}>Раздел в разработке</p>
    </div>
  );
}