import { useState } from "react";
import Icon from "@/components/ui/icon";

/* ─────────────────────────────────────
   TYPES & DATA
───────────────────────────────────── */
type Screen =
  | "home"
  | "schedule"
  | "detail"
  | "popup"
  | "success"
  | "waitlist"
  | "error";

interface Training {
  id: number;
  title: string;
  time: string;
  timeEnd: string;
  trainer: string;
  trainerExp: string;
  spots: number;
  totalSpots: number;
  category: string;
  intensity: 1 | 2 | 3;
  desc: string;
  location: string;
  color: string;
}

const TRAININGS: Training[] = [
  {
    id: 1,
    title: "Функциональный тренинг",
    time: "19:00",
    timeEnd: "20:00",
    trainer: "Мария К.",
    trainerExp: "5 лет",
    spots: 3,
    totalSpots: 15,
    category: "Силовые",
    intensity: 3,
    desc: "Интенсивная тренировка для всех уровней. Включает работу с весом тела, TRX и гантелями. Подходит для тех, кто хочет улучшить силу и выносливость.",
    location: "Клуб на Тверской",
    color: "#3B82F6",
  },
  {
    id: 2,
    title: "Утренняя йога",
    time: "08:00",
    timeEnd: "09:00",
    trainer: "Анна С.",
    trainerExp: "7 лет",
    spots: 0,
    totalSpots: 12,
    category: "Йога",
    intensity: 1,
    desc: "Мягкая практика для начала дня. Растяжка, дыхание, медитация.",
    location: "Клуб на Тверской",
    color: "#8B5CF6",
  },
  {
    id: 3,
    title: "Кардио-взрыв",
    time: "12:00",
    timeEnd: "12:45",
    trainer: "Игорь В.",
    trainerExp: "4 года",
    spots: 7,
    totalSpots: 20,
    category: "Кардио",
    intensity: 3,
    desc: "Высокоинтенсивное кардио для сжигания калорий. HIIT-подход.",
    location: "Клуб на Тверской",
    color: "#EF4444",
  },
  {
    id: 4,
    title: "Пилатес",
    time: "17:00",
    timeEnd: "18:00",
    trainer: "Ольга М.",
    trainerExp: "6 лет",
    spots: 5,
    totalSpots: 10,
    category: "Пилатес",
    intensity: 2,
    desc: "Глубокая проработка корсетных мышц. Идеально для осанки.",
    location: "Клуб на Тверской",
    color: "#10B981",
  },
];

const TODAY_UPCOMING = [TRAININGS[0], TRAININGS[2]];

/* ─────────────────────────────────────
   MAIN APP
───────────────────────────────────── */
export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selected, setSelected] = useState<Training | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Все");
  const [activeNav, setActiveNav] = useState("home");
  const [history, setHistory] = useState<Screen[]>([]);

  const go = (s: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
  };
  const back = () => {
    const prev = history[history.length - 1] ?? "home";
    setHistory((h) => h.slice(0, -1));
    setScreen(prev);
  };

  const openDetail = (t: Training) => {
    setSelected(t);
    go("detail");
  };

  const handleBook = () => {
    if (!selected) return;
    if (selected.spots === 0) {
      go("waitlist");
    } else {
      go("popup");
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{ background: "#DDE3ED", fontFamily: "'Rubik', sans-serif" }}
    >
      {/* Phone shell */}
      <div
        className="relative w-full max-w-[390px] overflow-hidden"
        style={{
          background: "#F5F7FA",
          borderRadius: 44,
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.22), 0 0 0 12px #1C1C1E, 0 0 0 13px #3A3A3C",
          minHeight: 830,
        }}
      >
        <StatusBar />

        <div className="pb-24">
          {screen === "home" && (
            <HomeScreen
              onOpenSchedule={() => { go("schedule"); setActiveNav("schedule"); }}
              onOpenDetail={openDetail}
              activeNav={activeNav}
              setActiveNav={(n) => {
                setActiveNav(n);
                if (n === "schedule") go("schedule");
              }}
            />
          )}
          {screen === "schedule" && (
            <ScheduleScreen
              onBack={back}
              onOpenDetail={openDetail}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              activeNav={activeNav}
              setActiveNav={(n) => {
                setActiveNav(n);
                if (n === "home") { setScreen("home"); setHistory([]); }
              }}
            />
          )}
          {screen === "detail" && selected && (
            <DetailScreen
              training={selected}
              onBack={back}
              onBook={handleBook}
              onWaitlist={() => go("waitlist")}
            />
          )}
          {screen === "popup" && selected && (
            <ConfirmPopup
              training={selected}
              onClose={() => { setScreen("home"); setHistory([]); setActiveNav("home"); }}
              onCalendar={() => { setHistory([]); go("success"); }}
            />
          )}
          {screen === "success" && selected && (
            <SuccessScreen
              training={selected}
              onHome={() => { setScreen("home"); setHistory([]); setActiveNav("home"); }}
            />
          )}
          {screen === "waitlist" && selected && (
            <WaitlistScreen
              training={selected}
              onAddWaitlist={() => { setHistory([]); go("success"); }}
              onChooseOther={() => { setScreen("schedule"); setHistory([]); setActiveNav("schedule"); }}
            />
          )}
          {screen === "error" && selected && (
            <ErrorScreen
              onRetry={() => go("detail")}
              onSupport={() => {}}
            />
          )}
        </div>

        {/* Bottom nav (hidden on detail/popup/success) */}
        {!["popup", "success", "detail"].includes(screen) && (
          <BottomNav
            active={activeNav}
            onChange={(n) => {
              setActiveNav(n);
              if (n === "home") { setScreen("home"); setHistory([]); }
              else if (n === "schedule") go("schedule");
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   STATUS BAR
───────────────────────────────────── */
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-4 pb-2">
      <span className="text-[13px] font-semibold" style={{ color: "#1C1C1E" }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <Icon name="Signal" size={14} style={{ color: "#1C1C1E" }} />
        <Icon name="Wifi" size={14} style={{ color: "#1C1C1E" }} />
        <Icon name="Battery" size={14} style={{ color: "#1C1C1E" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   BOTTOM NAV
───────────────────────────────────── */
function BottomNav({ active, onChange }: { active: string; onChange: (n: string) => void }) {
  const items = [
    { id: "home", icon: "Home", label: "Главная" },
    { id: "schedule", icon: "Calendar", label: "Расписание" },
    { id: "stats", icon: "BarChart2", label: "Статистика" },
    { id: "profile", icon: "User", label: "Профиль" },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2 pt-3 pb-6"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
          onClick={() => onChange(item.id)}
        >
          <Icon
            name={item.icon}
            size={22}
            style={{ color: active === item.id ? "#3B82F6" : "#B0BAC9" }}
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: active === item.id ? "#3B82F6" : "#B0BAC9" }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   SCREEN 1 — HOME
───────────────────────────────────── */
function HomeScreen({
  onOpenSchedule,
  onOpenDetail,
}: {
  onOpenSchedule: () => void;
  onOpenDetail: (t: Training) => void;
  activeNav: string;
  setActiveNav: (n: string) => void;
}) {
  return (
    <div className="px-5 pt-2 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[13px] font-medium mb-0.5" style={{ color: "#8896AA" }}>
            Понедельник, 14 апреля
          </p>
          <h1 className="text-[26px] font-bold leading-tight" style={{ color: "#1A202C" }}>
            Добро пожаловать,<br />
            <span style={{ color: "#3B82F6" }}>Анна!</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8896AA" }}>
            Начните день с тренировки
          </p>
        </div>
        <button
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "#3B82F6" }}
        >
          <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>А</span>
        </button>
      </div>

      {/* Hero card */}
      <div
        className="rounded-3xl p-5 mb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" }}
      >
        <div
          className="absolute -top-6 -right-6 w-32 h-32 rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />
        <div
          className="absolute bottom-0 right-10 w-16 h-16 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)", transform: "translateY(40%)" }}
        />
        <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
          Сегодня доступно
        </p>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "white" }}>
          4 тренировки
        </h2>
        <button
          onClick={onOpenSchedule}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: "white", color: "#3B82F6" }}
        >
          <Icon name="Calendar" size={16} />
          Открыть расписание
        </button>
      </div>

      {/* Upcoming */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base" style={{ color: "#1A202C" }}>
            Ближайшие сегодня
          </h3>
          <button
            className="text-xs font-medium"
            style={{ color: "#3B82F6" }}
            onClick={onOpenSchedule}
          >
            Все →
          </button>
        </div>
        <div className="space-y-3">
          {TODAY_UPCOMING.map((t, i) => (
            <MiniCard
              key={t.id}
              training={t}
              delay={i * 80}
              onClick={() => onOpenDetail(t)}
            />
          ))}
        </div>
      </div>

      {/* Progress banner */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "#EEF4FF", border: "1px solid #DBEAFE" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#3B82F6" }}
        >
          <Icon name="Zap" size={18} style={{ color: "white" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#1A202C" }}>
            Ваша цель: 3 тренировки в неделю
          </p>
          <p className="text-xs" style={{ color: "#8896AA" }}>
            Вы прошли 1 из 3 — отличный старт!
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SCREEN 2 — SCHEDULE
───────────────────────────────────── */
const FILTERS_LIST = ["Все", "Силовые", "Йога", "Кардио", "Пилатес"];

function ScheduleScreen({
  onBack,
  onOpenDetail,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: {
  onBack: () => void;
  onOpenDetail: (t: Training) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  activeNav: string;
  setActiveNav: (n: string) => void;
}) {
  const filtered = TRAININGS.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === "Все" || t.category === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-2 mb-4">
        {/* Back + title */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "#EEF4FF" }}
          >
            <Icon name="ChevronLeft" size={20} style={{ color: "#3B82F6" }} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: "#1A202C" }}>Расписание</h1>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-4"
          style={{ background: "white", border: "1.5px solid #E8EDF5" }}
        >
          <Icon name="Search" size={17} style={{ color: "#B0BAC9" }} />
          <input
            type="text"
            placeholder="Найти тренировку"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: "#1A202C" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <Icon name="X" size={14} style={{ color: "#B0BAC9" }} />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS_LIST.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: activeFilter === f ? "#3B82F6" : "white",
                color: activeFilter === f ? "white" : "#8896AA",
                border: activeFilter === f ? "none" : "1.5px solid #E8EDF5",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#B0BAC9" }}>
          Расписание на сегодня
        </h2>
      </div>

      <div className="px-5 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm" style={{ color: "#B0BAC9" }}>Ничего не найдено</p>
          </div>
        )}
        {filtered.map((t, i) => (
          <ScheduleCard
            key={t.id}
            training={t}
            delay={i * 70}
            onClick={() => onOpenDetail(t)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SCREEN 3 — DETAIL
───────────────────────────────────── */
function DetailScreen({
  training: t,
  onBack,
  onBook,
  onWaitlist,
}: {
  training: Training;
  onBack: () => void;
  onBook: () => void;
  onWaitlist: () => void;
}) {
  const occupancy = (t.totalSpots - t.spots) / t.totalSpots;
  const hasSpots = t.spots > 0;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div
        className="relative px-5 pt-2 pb-6"
        style={{ background: `linear-gradient(160deg, ${t.color}15 0%, transparent 100%)` }}
      >
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <Icon name="ChevronLeft" size={20} style={{ color: "#1A202C" }} />
          </button>
          <span className="text-sm font-medium" style={{ color: "#8896AA" }}>
            Детали тренировки
          </span>
        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: t.color + "18" }}
        >
          <Icon name="Dumbbell" size={28} style={{ color: t.color }} />
        </div>
        <h1 className="text-2xl font-bold mb-0.5" style={{ color: "#1A202C" }}>
          {t.title}
        </h1>
        <p className="text-sm" style={{ color: "#8896AA" }}>{t.category}</p>
      </div>

      <div className="px-5">
        {/* Meta grid */}
        <div
          className="rounded-3xl p-4 mb-4 grid grid-cols-2 gap-3"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <MetaItem icon="Clock" label="Время" value={`${t.time} — ${t.timeEnd}`} color={t.color} />
          <MetaItem icon="User" label="Тренер" value={t.trainer} color={t.color} />
          <MetaItem icon="Award" label="Опыт тренера" value={t.trainerExp} color={t.color} />
          <MetaItem icon="MapPin" label="Место" value={t.location} color={t.color} />
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1.5" style={{ color: "#1A202C" }}>
            Описание
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
            {t.desc}
          </p>
        </div>

        {/* Spots bar */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: hasSpots ? "#F0FDF4" : "#FEF2F2",
            border: `1.5px solid ${hasSpots ? "#BBF7D0" : "#FECACA"}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon
                name={hasSpots ? "Users" : "UserX"}
                size={16}
                style={{ color: hasSpots ? "#10B981" : "#EF4444" }}
              />
              <span className="text-sm font-medium" style={{ color: "#1A202C" }}>
                {hasSpots ? `Свободных мест: ${t.spots}` : "Мест нет"}
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: hasSpots ? "#BBF7D0" : "#FECACA",
                color: hasSpots ? "#065F46" : "#991B1B",
              }}
            >
              {hasSpots ? "Доступно" : "Нет мест"}
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.07)" }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${occupancy * 100}%`,
                background: occupancy >= 1 ? "#EF4444" : occupancy >= 0.8 ? "#F97316" : "#10B981",
              }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: "#A0AEC0" }}>
            {t.totalSpots - t.spots} из {t.totalSpots} мест занято
          </p>
        </div>

        {/* Trainer link */}
        <button
          className="flex items-center gap-2 mb-4 text-sm font-medium"
          style={{ color: t.color }}
        >
          <Icon name="ExternalLink" size={14} />
          Посмотреть профиль тренера
        </button>

        {/* CTA buttons */}
        {hasSpots ? (
          <>
            <button
              onClick={onBook}
              className="w-full py-4 rounded-2xl font-bold text-base mb-3 transition-all hover:opacity-90 active:scale-95"
              style={{ background: t.color, color: "white" }}
            >
              Записаться
            </button>
            <button
              className="w-full py-3.5 rounded-2xl font-semibold text-sm"
              style={{ background: "#F3F4F6", color: "#B0BAC9" }}
              disabled
            >
              Добавить в лист ожидания
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full py-4 rounded-2xl font-bold text-base mb-3 opacity-30"
              style={{ background: "#6B7280", color: "white" }}
              disabled
            >
              Записаться
            </button>
            <button
              onClick={onWaitlist}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: "white", color: "#1A202C", border: "1.5px solid #E5E7EB" }}
            >
              Добавить в лист ожидания
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SCREEN 4 — CONFIRM POPUP
───────────────────────────────────── */
function ConfirmPopup({
  training: t,
  onClose,
  onCalendar,
}: {
  training: Training;
  onClose: () => void;
  onCalendar: () => void;
}) {
  return (
    <div
      className="animate-fade-in relative"
      style={{ minHeight: 780 }}
    >
      {/* Blur backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      />
      {/* Bottom sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pt-6 pb-8 animate-fade-in"
        style={{
          background: "white",
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="w-10 h-1 rounded-full mx-auto mb-6"
          style={{ background: "#E5E7EB" }}
        />
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#ECFDF5", border: "3px solid #BBF7D0" }}
          >
            <Icon name="CheckCircle2" size={40} style={{ color: "#10B981" }} />
          </div>
          <h2 className="text-xl font-bold text-center mb-1" style={{ color: "#1A202C" }}>
            Место успешно забронировано!
          </h2>
          <p className="text-sm text-center" style={{ color: "#8896AA" }}>
            Тренировка добавлена в ваш календарь
          </p>
        </div>

        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: "#A0AEC0" }}>
            Детали
          </p>
          <div className="space-y-2.5">
            <DetailRow icon="Dumbbell" text={t.title} color={t.color} />
            <DetailRow icon="Clock" text={`${t.time} — ${t.timeEnd}`} color={t.color} />
            <DetailRow icon="User" text={t.trainer} color={t.color} />
          </div>
        </div>

        <button
          onClick={onCalendar}
          className="w-full py-4 rounded-2xl font-bold text-base mb-3 transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#3B82F6", color: "white" }}
        >
          Открыть календарь
        </button>
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm"
          style={{ background: "#F3F4F6", color: "#6B7280" }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SCREEN 5 — SUCCESS
───────────────────────────────────── */
function SuccessScreen({
  training: t,
  onHome,
}: {
  training: Training;
  onHome: () => void;
}) {
  return (
    <div className="px-5 pt-6 animate-fade-in">
      <div className="flex flex-col items-center mb-7 pt-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
            boxShadow: "0 10px 40px rgba(16,185,129,0.28)",
          }}
        >
          <Icon name="Check" size={44} style={{ color: "#10B981" }} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1.5" style={{ color: "#1A202C" }}>
          Отлично, вы записаны!
        </h1>
        <p className="text-sm text-center" style={{ color: "#8896AA" }}>
          Ждём вас на тренировке в {t.time}
        </p>
      </div>

      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#B0BAC9" }}>
          Детали записи
        </h3>
        <div className="space-y-3">
          <DetailRow icon="Dumbbell" label="Тренировка" text={t.title} color={t.color} />
          <div style={{ height: 1, background: "#F3F4F6" }} />
          <DetailRow icon="Calendar" label="Дата и время" text={`Сегодня, ${t.time}–${t.timeEnd}`} color={t.color} />
          <div style={{ height: 1, background: "#F3F4F6" }} />
          <DetailRow icon="User" label="Тренер" text={t.trainer} color={t.color} />
          <div style={{ height: 1, background: "#F3F4F6" }} />
          <DetailRow icon="MapPin" label="Место" text={t.location} color={t.color} />
        </div>
      </div>

      <div
        className="flex items-start gap-3 rounded-2xl p-4 mb-5"
        style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
      >
        <Icon name="Bell" size={18} style={{ color: "#F59E0B", marginTop: 2 }} />
        <p className="text-sm" style={{ color: "#92400E" }}>
          За час до тренировки придёт push-уведомление
        </p>
      </div>

      <button
        onClick={onHome}
        className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
        style={{ background: "#3B82F6", color: "white" }}
      >
        Вернуться на главную
      </button>
    </div>
  );
}

/* ─────────────────────────────────────
   SCREEN A1 — WAITLIST
───────────────────────────────────── */
function WaitlistScreen({
  training: t,
  onAddWaitlist,
  onChooseOther,
}: {
  training: Training;
  onAddWaitlist: () => void;
  onChooseOther: () => void;
}) {
  return (
    <div className="px-5 pt-6 animate-fade-in">
      <div className="flex flex-col items-center mb-7 pt-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
            boxShadow: "0 10px 40px rgba(245,158,11,0.22)",
          }}
        >
          <Icon name="Clock" size={44} style={{ color: "#F59E0B" }} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1.5" style={{ color: "#1A202C" }}>
          Нет свободных мест
        </h1>
        <p className="text-sm text-center leading-relaxed" style={{ color: "#8896AA", maxWidth: 270 }}>
          Добавьте себя в лист ожидания — мы сообщим, если место освободится
        </p>
      </div>

      <div
        className="rounded-3xl p-4 mb-4"
        style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: "#A0AEC0" }}>Тренировка</p>
        <DetailRow icon="Dumbbell" text={t.title} color="#F59E0B" />
        <div style={{ height: 1, background: "#F3F4F6", margin: "12px 0" }} />
        <DetailRow icon="Clock" text={`${t.time} — ${t.timeEnd}`} color="#F59E0B" />
      </div>

      <div
        className="flex items-start gap-3 rounded-2xl p-4 mb-5"
        style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
      >
        <Icon name="Smartphone" size={17} style={{ color: "#F59E0B", marginTop: 2 }} />
        <p className="text-sm" style={{ color: "#92400E" }}>
          Как только место появится — придёт push-уведомление
        </p>
      </div>

      <button
        onClick={onAddWaitlist}
        className="w-full py-4 rounded-2xl font-bold text-base mb-3 transition-all hover:opacity-90 active:scale-95"
        style={{ background: "#F59E0B", color: "white" }}
      >
        Добавить в лист ожидания
      </button>
      <button
        onClick={onChooseOther}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all"
        style={{ background: "#F3F4F6", color: "#6B7280" }}
      >
        Выбрать другую тренировку
      </button>
    </div>
  );
}

/* ─────────────────────────────────────
   SCREEN A2 — ERROR
───────────────────────────────────── */
function ErrorScreen({
  onRetry,
  onSupport,
}: {
  onRetry: () => void;
  onSupport: () => void;
}) {
  return (
    <div className="px-5 pt-6 animate-fade-in">
      <div className="flex flex-col items-center mb-7 pt-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
            boxShadow: "0 10px 40px rgba(249,115,22,0.22)",
          }}
        >
          <Icon name="AlertTriangle" size={44} style={{ color: "#F97316" }} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1.5" style={{ color: "#1A202C" }}>
          Не удалось забронировать
        </h1>
        <p className="text-sm text-center leading-relaxed" style={{ color: "#8896AA", maxWidth: 270 }}>
          Попробуйте ещё раз или обратитесь в поддержку
        </p>
      </div>

      <div
        className="flex items-start gap-3 rounded-2xl p-4 mb-6"
        style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
      >
        <Icon name="Info" size={17} style={{ color: "#F97316", marginTop: 2 }} />
        <p className="text-sm" style={{ color: "#9A3412" }}>
          Ошибка соединения. Проверьте интернет и попробуйте снова.
        </p>
      </div>

      <button
        onClick={onRetry}
        className="w-full py-4 rounded-2xl font-bold text-base mb-3 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
        style={{ background: "#3B82F6", color: "white" }}
      >
        <Icon name="RefreshCw" size={18} />
        Повторить
      </button>
      <button
        onClick={onSupport}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        style={{ background: "white", color: "#6B7280", border: "1.5px solid #E5E7EB" }}
      >
        <Icon name="MessageCircle" size={16} />
        Написать в поддержку
      </button>
    </div>
  );
}

/* ─────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────── */
function MiniCard({
  training: t,
  delay,
  onClick,
}: {
  training: Training;
  delay: number;
  onClick: () => void;
}) {
  const hasSpots = t.spots > 0;
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] animate-fade-in"
      style={{
        background: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: t.color + "18" }}
      >
        <Icon name="Dumbbell" size={20} style={{ color: t.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: "#1A202C" }}>
          {t.title}
        </p>
        <p className="text-xs" style={{ color: "#A0AEC0" }}>
          {t.time} · {t.trainer}
        </p>
      </div>
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
        style={{
          background: hasSpots ? "#ECFDF5" : "#FEF2F2",
          color: hasSpots ? "#065F46" : "#991B1B",
        }}
      >
        {hasSpots ? `${t.spots} места` : "Нет мест"}
      </span>
    </button>
  );
}

function ScheduleCard({
  training: t,
  delay,
  onClick,
}: {
  training: Training;
  delay: number;
  onClick: () => void;
}) {
  const hasSpots = t.spots > 0;
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] animate-fade-in"
      style={{
        background: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        animationDelay: `${delay}ms`,
        borderLeft: `4px solid ${hasSpots ? t.color : "#D1D5DB"}`,
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <p className="font-bold text-[15px]" style={{ color: "#1A202C" }}>{t.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <Icon name="Clock" size={11} style={{ color: "#B0BAC9" }} />
              <span className="text-xs" style={{ color: "#B0BAC9" }}>{t.time}</span>
              <span style={{ color: "#E5E7EB" }}>·</span>
              <Icon name="User" size={11} style={{ color: "#B0BAC9" }} />
              <span className="text-xs" style={{ color: "#B0BAC9" }}>{t.trainer}</span>
            </div>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{
              background: hasSpots ? "#ECFDF5" : "#FEF2F2",
              color: hasSpots ? "#065F46" : "#991B1B",
            }}
          >
            {hasSpots ? `${t.spots} мест` : "Нет мест"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full" style={{ background: "#F3F4F6" }}>
            <div
              className="h-1 rounded-full"
              style={{
                width: `${((t.totalSpots - t.spots) / t.totalSpots) * 100}%`,
                background: hasSpots ? t.color : "#D1D5DB",
              }}
            />
          </div>
          <span className="text-[11px]" style={{ color: "#B0BAC9" }}>
            {t.totalSpots - t.spots}/{t.totalSpots}
          </span>
        </div>
      </div>
    </button>
  );
}

function MetaItem({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon name={icon} size={12} style={{ color }} />
        <span className="text-[11px]" style={{ color: "#B0BAC9" }}>{label}</span>
      </div>
      <p className="text-sm font-semibold" style={{ color: "#1A202C" }}>{value}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  text,
  color,
}: {
  icon: string;
  label?: string;
  text: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + "18" }}
      >
        <Icon name={icon} size={15} style={{ color }} />
      </div>
      <div>
        {label && (
          <p className="text-[11px]" style={{ color: "#B0BAC9" }}>{label}</p>
        )}
        <p className="text-sm font-medium" style={{ color: "#1A202C" }}>{text}</p>
      </div>
    </div>
  );
}
