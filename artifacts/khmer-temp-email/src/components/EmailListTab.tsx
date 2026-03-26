import { useState } from "react";
import { Trash2, CheckCircle2, Mail, Copy, Check, Search } from "lucide-react";
import type { EmailHistoryItem } from "@/hooks/use-email-session";

interface EmailListTabProps {
  history: EmailHistoryItem[];
  activeSessionId: string | null;
  onSwitch: (item: EmailHistoryItem) => void;
  onDelete: (sessionId: string) => void;
}

export function EmailListTab({ history, activeSessionId, onSwitch, onDelete }: EmailListTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleCopy = (item: EmailHistoryItem) => {
    navigator.clipboard.writeText(item.email);
    setCopiedId(item.sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = history.filter((item) =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Email ទាំងអស់
        </p>
        <span className="text-xs font-bold text-green-400 bg-green-500/15 px-2 py-0.5 rounded-full">
          {history.length} អាចទទួលសារ
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ស្វែងរក Email"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Search className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">រកមិនឃើញ Email</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const isActive = item.sessionId === activeSessionId;
            const isCopied = copiedId === item.sessionId;

            return (
              <div
                key={item.sessionId}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isActive
                    ? 'bg-green-500/5 border-green-500/30 shadow-sm shadow-green-500/10'
                    : 'bg-card border-border/50'
                }`}
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center font-black text-xs text-white shadow-sm shadow-green-500/30">
                      @
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-background rounded-full" />
                  </div>

                  <button
                    onClick={() => onSwitch(item)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-foreground break-all">{item.email}</p>
                      {isActive ? (
                        <span className="text-[10px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full shrink-0">
                          កំពុងប្រើ
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full shrink-0">
                          អាចទទួលសារ
                        </span>
                      )}
                    </div>
                  </button>

                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  )}

                  <button
                    onClick={() => handleCopy(item)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl active:scale-95 transition-all shrink-0 ${
                      isCopied
                        ? 'text-green-400 bg-green-500/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onDelete(item.sessionId)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
