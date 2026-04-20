import { useState } from "react";
import Icon from "@/components/ui/icon";

/* ─── Data ─── */
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DATES = [14, 15, 16, 17, 18, 19, 20];
const FILTERS = ["Все", "Йога", "Кардио", "Силовые", "Растяжка", "Бокс", "Пилатес"];

type ClassStatus = "available" | "waitlist" | "booked" | "full";

interface FitClass {
  id: number;
  title: string;
  trainer: string;
  time: string;
  duration: number;
  day: number;
  spots: number;
  total: number;
  category: string;
  status: ClassStatus;
  intensity: 1 | 2 | 3;
  color: string;
}

const CLASSES: FitClass[] = [
  { id: 1, title: "Утренняя йога", trainer: "Анна К.", time: "07:00", duration: 60, day: 0, spots: 3, total: 15, category: "Йога", status: "available", intensity: 1, color: "#6366f1" },
  { id: 2, title: "Кардио-взрыв", trainer: "Максим Р.", time: "09:30", duration: 45, day: 0, spots: 0, total: 20, category: "Кардио", status: "full", intensity: 3, color: "#f43f5e" },
  { id: 3, title: "Силовая TRX", trainer: "Илья С.", time: "11:00", duration: 50, day: 0, spots: 1, total: 12, category: "Силовые", status: "waitlist", intensity: 3, color: "#f97316" },
  { id: 4, title: "Пилатес", trainer: "Ольга М.", time: "18:00", duration: 55, day: 0, spots: 8, total: 15, category: "Пилатес", status: "available", intensity: 1, color: "#8b5cf6" },
  { id: 5, title: "Вечерний бокс", trainer: "Дмитрий В.", time: "20:00", duration: 60, day: 0, spots: 5, total: 16, category: "Бокс", status: "available", intensity: 3, color: "#ef4444" },
  { id: 6, title: "Йога Flow", trainer: "Анна К.", time: "08:00", duration: 75, day: 1, spots: 0, total: 15, category: "Йога", status: "waitlist", intensity: 2, color: "#6366f1" },
  { id: 7, title: "HIIT тренировка", trainer: "Максим Р.", time: "12:00", duration: 40, day: 1, spots: 12, total: 20, category: "Кардио", status: "available", intensity: 3, color: "#f43f5e" },
  { id: 8, title: "Растяжка", trainer: "Ольга М.", time: "19:30", duration: 45, day: 1, spots: 10, total: 20, category: "Растяжка", status: "available", intensity: 1, color: "#10b981" },
  { id: 9, title: "CrossFit", trainer: "Илья С.", time: "07:30", duration: 60, day: 2, spots: 2, total: 15, category: "Силовые", status: "available", intensity: 3, color: "#f97316" },
  { id: 10, title: "Медитация", trainer: "Анна К.", time: "09:00", duration: 30, day: 2, spots: 15, total: 20, category: "Йога", status: "available", intensity: 1, color: "#6366f1" },
  { id: 11, title: "Бокс для начинающих", trainer: "Дмитрий В.", time: "18:30", duration: 50, day: 2, spots: 4, total: 12, category: "Бокс", status: "available", intensity: 2, color: "#ef4444" },
  { id: 12, title: "Кардио микс", trainer: "Максим Р.", time: "07:00", duration: 45, day: 3, spots: 0, total: 20, category: "Кардио", status: "booked", intensity: 2, color: "#f43f5e" },
  { id: 13, title: "Силовая + кор", trainer: "Илья С.", time: "10:00", duration: 60, day: 3, spots: 6, total: 15, category: "Силовые", status: "available", intensity: 3, color: "#f97316" },
  { id: 14, title: "Пилатес для спины", trainer: "Ольга М.", time: "19:00", duration: 55, day: 3, spots: 9, total: 15, category: "Пилатес", status: "available", intensity: 1, color: "#8b5cf6" },
  { id: 15, title: "Йога восстановление", trainer: "Анна К.", time: "08:30", duration: 60, day: 4, spots: 7, total: 15, category: "Йога", status: "available", intensity: 1, color: "#6366f1" },
  { id: 16, title: "Табата", trainer: "Максим Р.", time: "19:00", duration: 45, day: 5, spots: 3, total: 20, category: "Кардио", status: "available", intensity: 3, color: "#f43f5e" },
  { id: 17, title: "Растяжка глубокая", trainer: "Ольга М.", time: "11:00", duration: 60, day: 6, spots: 12, total: 20, category: "Растяжка", status: "available", intensity: 1, color: "#10b981" },
];

type ModalState =
  | { type: "confirm"; cls: FitClass }
  | { type: "success"; cls: FitClass }
  | { type: "waitlist"; cls: FitClass }
  | { type: "error"; cls: FitClass }
  | { type: "chat" }
  | null;

const intensityDots = (n: 1 | 2 | 3) =>
  [1, 2, 3].map(i => (
    <span key={i} className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: i <= n ? "currentColor" : "rgba(255,255,255,0.2)" }} />
  ));

export default function Index() {
  const [activeDay, setActiveDay] = useState(2);
  const [activeFilter, setActiveFilter] = useState("Все");
  const [modal, setModal] = useState<ModalState>(null);
  const [bookedIds, setBookedIds] = useState<number[]>([12]);
  const [waitlistIds, setWaitlistIds] = useState<number[]>([]);
  const [simulateError, setSimulateError] = useState(false);

  const dayClasses = CLASSES.filter(c =>
    c.day === activeDay &&
    (activeFilter === "Все" || c.category === activeFilter)
  ).map(c => {
    if (bookedIds.includes(c.id)) return { ...c, status: "booked" as ClassStatus };
    if (waitlistIds.includes(c.id)) return { ...c, status: "waitlist" as ClassStatus };
    return c;
  });

  const handleBook = (cls: FitClass) => {
    if (cls.status === "booked") return;
    setModal({ type: "confirm", cls });
  };

  const confirmBook = (cls: FitClass) => {
    if (simulateError) {
      setSimulateError(false);
      setModal({ type: "error", cls });
      return;
    }
    if (cls.spots === 0 || cls.status === "waitlist") {
      setWaitlistIds(prev => [...prev, cls.id]);
      setModal({ type: "waitlist", cls });
    } else {
      setBookedIds(prev => [...prev, cls.id]);
      setModal({ type: "success", cls });
    }
  };

  const closeModal = () => setModal(null);

  return (
    <div className="min-h-screen flex justify-center items-start py-8 px-4" style={{ background: "#0a0a0f", fontFamily: "'Rubik', sans-serif" }}>
      {/* Phone frame */}
      <div className="relative w-full max-w-sm" style={{ background: "#111118", borderRadius: 40, boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)", overflow: "hidden", minHeight: 780 }}>

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>9:41</span>
          <div className="flex items-center gap-1.5">
            <Icon name="Signal" size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
            <Icon name="Wifi" size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
            <Icon name="Battery" size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
          </div>
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Привет, Александр 👋</p>
              <h1 className="text-xl font-bold" style={{ color: "white", letterSpacing: "-0.5px" }}>Расписание</h1>
            </div>
            <button className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: "rgba(255,255,255,0.08)" }}>
              <Icon name="Bell" size={18} style={{ color: "white" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f43f5e", border: "1.5px solid #111118" }} />
            </button>
          </div>
        </div>

        {/* Day picker */}
        <div className="px-5 mb-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setActiveDay(i)}
                className="flex flex-col items-center shrink-0 rounded-2xl py-2.5 transition-all duration-200"
                style={{
                  width: 44,
                  background: activeDay === i ? "#f43f5e" : "rgba(255,255,255,0.06)",
                  transform: activeDay === i ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="text-xs font-medium mb-1" style={{ color: activeDay === i ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}>{d}</span>
                <span className="text-sm font-bold" style={{ color: activeDay === i ? "white" : "rgba(255,255,255,0.7)" }}>{DATES[i]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <div className="flex gap-2 px-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200"
                style={{
                  background: activeFilter === f ? "white" : "rgba(255,255,255,0.07)",
                  color: activeFilter === f ? "#0a0a0f" : "rgba(255,255,255,0.5)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Classes list */}
        <div className="px-5 space-y-3 pb-24">
          {dayClasses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🧘</p>
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Занятий нет</p>
            </div>
          )}
          {dayClasses.map((cls, i) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              delay={i * 60}
              onBook={() => handleBook(cls)}
            />
          ))}
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-4" style={{ background: "linear-gradient(to top, #111118 70%, transparent)" }}>
          <div className="flex justify-around">
            {[
              { icon: "Calendar", label: "Расписание", active: true },
              { icon: "Dumbbell", label: "Тренировки", active: false },
              { icon: "User", label: "Профиль", active: false },
            ].map(n => (
              <button key={n.label} className="flex flex-col items-center gap-1">
                <Icon name={n.icon} size={22} style={{ color: n.active ? "#f43f5e" : "rgba(255,255,255,0.3)" }} />
                <span className="text-xs font-medium" style={{ color: n.active ? "#f43f5e" : "rgba(255,255,255,0.3)" }}>{n.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modals */}
        {modal && (
          <div className="absolute inset-0 flex items-end" style={{ background: "rgba(0,0,0,0.7)", zIndex: 50 }} onClick={closeModal}>
            <div className="w-full" style={{ borderRadius: "24px 24px 0 0", background: "#1a1a24", padding: "24px 20px 36px" }} onClick={e => e.stopPropagation()}>

              {modal.type === "confirm" && (
                <ConfirmModal cls={modal.cls} onConfirm={() => confirmBook(modal.cls)} onClose={closeModal} onSimulateError={() => { setSimulateError(true); confirmBook(modal.cls); }} />
              )}
              {modal.type === "success" && (
                <SuccessModal cls={modal.cls} onClose={closeModal} />
              )}
              {modal.type === "waitlist" && (
                <WaitlistModal cls={modal.cls} onClose={closeModal} />
              )}
              {modal.type === "error" && (
                <ErrorModal cls={modal.cls} onRetry={() => { setModal({ type: "confirm", cls: modal.cls }); }} onChat={() => setModal({ type: "chat" })} />
              )}
              {modal.type === "chat" && (
                <ChatModal onClose={closeModal} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ClassCard ─── */
function ClassCard({ cls, delay, onBook }: { cls: FitClass; delay: number; onBook: () => void }) {
  const occupancy = (cls.total - cls.spots) / cls.total;

  const statusLabel: Record<ClassStatus, string> = {
    available: "Записаться",
    waitlist: cls.status === "waitlist" ? "В очередь" : "В очередь",
    booked: "Записан ✓",
    full: "Мест нет",
  };

  const statusStyle: Record<ClassStatus, React.CSSProperties> = {
    available: { background: cls.color, color: "white" },
    waitlist: { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" },
    booked: { background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" },
    full: { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" },
  };

  return (
    <div
      className="animate-fade-in rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", animationDelay: `${delay}ms` }}
      onClick={cls.status !== "booked" && cls.status !== "full" ? onBook : undefined}
    >
      {/* Color accent bar */}
      <div className="h-1" style={{ background: cls.color, opacity: cls.status === "full" ? 0.3 : 1 }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-base leading-tight" style={{ color: cls.status === "full" ? "rgba(255,255,255,0.35)" : "white" }}>{cls.title}</span>
              {cls.status === "booked" && <Icon name="CheckCircle2" size={15} style={{ color: "#34d399", flexShrink: 0 }} />}
            </div>
            <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              <Icon name="User" size={11} />
              <span>{cls.trainer}</span>
              <span>·</span>
              <span>{cls.duration} мин</span>
              <span>·</span>
              <span className="flex items-center gap-0.5" style={{ color: cls.color }}>
                {intensityDots(cls.intensity)}
              </span>
            </div>

            {/* Occupancy bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${occupancy * 100}%`,
                    background: occupancy >= 1 ? "#ef4444" : occupancy >= 0.8 ? "#f97316" : cls.color
                  }}
                />
              </div>
              <span className="text-xs font-medium shrink-0" style={{ color: cls.spots === 0 ? "#ef4444" : "rgba(255,255,255,0.4)" }}>
                {cls.spots === 0 ? "0 мест" : `${cls.spots} мест`}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-3">
            <div className="text-right">
              <div className="text-lg font-bold leading-none" style={{ color: "white" }}>{cls.time}</div>
            </div>
            <button
              className="text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all"
              style={statusStyle[cls.status]}
              onClick={e => { e.stopPropagation(); if (cls.status !== "booked" && cls.status !== "full") onBook(); }}
            >
              {statusLabel[cls.status]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Modals ─── */
function ConfirmModal({ cls, onConfirm, onClose, onSimulateError }: { cls: FitClass; onConfirm: () => void; onClose: () => void; onSimulateError: () => void }) {
  return (
    <div>
      <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.15)" }} />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: cls.color + "25" }}>
          <Icon name="Dumbbell" size={22} style={{ color: cls.color }} />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight" style={{ color: "white" }}>{cls.title}</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{cls.trainer} · {cls.time} · {cls.duration} мин</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Доступно мест</span>
          <span className="font-semibold" style={{ color: cls.spots > 0 ? "#34d399" : "#f43f5e" }}>{cls.spots === 0 ? "Запись в очередь" : cls.spots}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Категория</span>
          <span className="font-semibold" style={{ color: "white" }}>{cls.category}</span>
        </div>
      </div>

      <button onClick={onConfirm}
        className="w-full py-3.5 rounded-2xl font-bold text-base mb-3 transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: cls.color, color: "white" }}>
        {cls.spots === 0 ? "Встать в очередь" : "Подтвердить запись"}
      </button>
      <button onClick={onClose}
        className="w-full py-3 rounded-2xl font-medium text-sm"
        style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
        Отмена
      </button>

      {/* Dev helper */}
      <button onClick={onSimulateError} className="w-full mt-2 text-xs py-1" style={{ color: "rgba(255,255,255,0.15)" }}>
        тест: ошибка бронирования
      </button>
    </div>
  );
}

function SuccessModal({ cls, onClose }: { cls: FitClass; onClose: () => void }) {
  return (
    <div className="text-center animate-fade-in">
      <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.15)" }} />
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.2)" }}>
        <Icon name="CheckCircle2" size={32} style={{ color: "#34d399" }} />
      </div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "white" }}>Место забронировано!</h2>
      <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{cls.title}</p>
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>{cls.time} · {cls.trainer}</p>
      <div className="rounded-2xl p-4 mb-5 text-left" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <div className="flex items-start gap-2">
          <Icon name="Bell" size={15} style={{ color: "#34d399", marginTop: 2 }} />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Мы отправим уведомление за 30 минут до начала занятия</p>
        </div>
      </div>
      <button onClick={onClose}
        className="w-full py-3.5 rounded-2xl font-bold text-base transition-all hover:opacity-90"
        style={{ background: "#34d399", color: "#0a0a0f" }}>
        Отлично!
      </button>
    </div>
  );
}

function WaitlistModal({ cls, onClose }: { cls: FitClass; onClose: () => void }) {
  return (
    <div className="text-center animate-fade-in">
      <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.15)" }} />
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(251,191,36,0.15)" }}>
        <Icon name="Clock" size={32} style={{ color: "#fbbf24" }} />
      </div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "white" }}>Вы в листе ожидания</h2>
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>Мест на {cls.title} нет, но вы первый в очереди</p>
      <div className="rounded-2xl p-4 mb-5 text-left" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
        <div className="flex items-start gap-2">
          <Icon name="Smartphone" size={15} style={{ color: "#fbbf24", marginTop: 2 }} />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Push-уведомление придёт, как только появится свободное место</p>
        </div>
      </div>
      <button onClick={onClose}
        className="w-full py-3.5 rounded-2xl font-bold text-base transition-all hover:opacity-90"
        style={{ background: "#fbbf24", color: "#0a0a0f" }}>
        Понятно
      </button>
    </div>
  );
}

function ErrorModal({ cls, onRetry, onChat }: { cls: FitClass; onRetry: () => void; onChat: () => void }) {
  return (
    <div className="animate-fade-in">
      <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.15)" }} />
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(244,63,94,0.15)" }}>
          <Icon name="WifiOff" size={30} style={{ color: "#f43f5e" }} />
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "white" }}>Не удалось забронировать</h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Произошла ошибка при записи на «{cls.title}»</p>
      </div>
      <button onClick={onRetry}
        className="w-full py-3.5 rounded-2xl font-bold text-base mb-3 transition-all hover:opacity-90"
        style={{ background: "#f43f5e", color: "white" }}>
        <span className="flex items-center justify-center gap-2">
          <Icon name="RefreshCw" size={17} />
          Повторить
        </span>
      </button>
      <button onClick={onChat}
        className="w-full py-3.5 rounded-2xl font-bold text-base transition-all"
        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
        <span className="flex items-center justify-center gap-2">
          <Icon name="MessageCircle" size={17} />
          Написать в поддержку
        </span>
      </button>
    </div>
  );
}

function ChatModal({ onClose }: { onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const msgs = [
    { from: "bot", text: "Привет! Как мы можем помочь?" },
    { from: "bot", text: "Менеджер Сергей уже онлайн и готов ответить." },
  ];

  return (
    <div className="animate-fade-in">
      <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#f43f5e" }}>
          <Icon name="Headphones" size={18} style={{ color: "white" }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "white" }}>Поддержка FitClub</p>
          <p className="text-xs flex items-center gap-1" style={{ color: "#34d399" }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#34d399" }} />
            Онлайн
          </p>
        </div>
        <button onClick={onClose} className="ml-auto p-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }}>
          <Icon name="X" size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
        </button>
      </div>

      <div className="space-y-2 mb-4 min-h-[80px]">
        {msgs.map((m, i) => (
          <div key={i} className="rounded-2xl rounded-tl-md px-4 py-2.5 inline-block" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontSize: 13, maxWidth: "85%" }}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Напишите сообщение..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
        />
        <button className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#f43f5e" }}>
          <Icon name="Send" size={16} style={{ color: "white" }} />
        </button>
      </div>
    </div>
  );
}
