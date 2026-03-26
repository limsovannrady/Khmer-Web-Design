import { Trash2, CheckCircle2, Mail } from "lucide-react";
import type { EmailHistoryItem } from "@/hooks/use-email-session";

interface EmailListTabProps {
  history: EmailHistoryItem[];
  activeSessionId: string | null;
  onSwitch: (item: EmailHistoryItem) => void;
  onDelete: (sessionId: string) => void;
}

export function EmailListTab({ history, activeSessionId, onSwitch, onDelete }: EmailListTabProps) {
  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16 pb-28 flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <Mail className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-bold text-foreground">មិនទាន់មាន Email</p>
        <p className="text-xs text-muted-foreground">Email ដែលបានបង្កើតនឹងបង្ហាញនៅទីនេះ</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-3">
      <p className="text-xs font-bold text-muted-foreground px-1 uppercase tracking-wider">
        Email ទាំងអស់ ({history.length})
      </p>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
        {history.map((item, index) => {
          const isActive = item.sessionId === activeSessionId;
          const date = new Date(item.createdAt);
          const timeStr = date.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
          const dateStr = date.toLocaleDateString('km-KH', { day: '2-digit', month: '2-digit' });

          return (
            <div key={item.sessionId}>
              {index > 0 && <div className="h-px bg-border/40 ml-[3.75rem]" />}
              <div className="flex items-center">
                <button
                  onClick={() => onSwitch(item)}
                  className="flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/40 active:bg-secondary/60 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-xs ${
                    isActive
                      ? 'bg-gradient-to-br from-primary to-amber-400 text-white shadow-sm'
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    @
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{item.email}</p>
                    <p className="text-xs text-muted-foreground">{dateStr} · {timeStr}</p>
                  </div>
                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
                <button
                  onClick={() => onDelete(item.sessionId)}
                  className="px-4 py-3.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
