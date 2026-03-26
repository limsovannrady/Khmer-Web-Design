import { useState } from "react";
import { Mail, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueries } from "@tanstack/react-query";
import { getGetMessagesQueryOptions } from "@workspace/api-client-react";
import { EmailViewer } from "./EmailViewer";
import type { EmailMessage } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface SessionItem {
  sessionId: string;
  email: string;
}

interface InboxProps {
  sessions: SessionItem[];
}

interface MessageWithMeta extends EmailMessage {
  toEmail: string;
}

const AVATAR_COLORS = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-green-500 to-emerald-400",
  "from-orange-500 to-amber-400",
  "from-red-500 to-rose-400",
  "from-indigo-500 to-violet-400",
];

function getAvatarColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitial(fromAddr: string) {
  const name = fromAddr.split('<')[0].trim() || fromAddr;
  return name[0]?.toUpperCase() || "?";
}

export function Inbox({ sessions }: InboxProps) {
  const [selectedMessage, setSelectedMessage] = useState<MessageWithMeta | null>(null);

  const results = useQueries({
    queries: sessions.map((s) => ({
      ...getGetMessagesQueryOptions(s.sessionId),
      refetchInterval: 5000,
      enabled: !!s.sessionId,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isRefetching = results.some((r) => r.isFetching);

  const refetchAll = () => results.forEach((r) => r.refetch());

  const allMessages: MessageWithMeta[] = results
    .flatMap((r, i) =>
      (r.data?.messages || []).map((msg) => ({
        ...msg,
        toEmail: sessions[i]?.email ?? "",
      }))
    )
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

  if (selectedMessage) {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <EmailViewer message={selectedMessage} onBack={() => setSelectedMessage(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-6 space-y-3">

      {/* Inbox Header */}
      <div className="flex items-center justify-between px-1" id="inbox">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-black text-foreground">ប្រអប់សំបុត្រ</h3>
          {allMessages.length > 0 && (
            <span className="px-2 py-0.5 bg-primary text-white rounded-full text-xs font-black shadow-sm shadow-primary/20">
              {allMessages.length}
            </span>
          )}
        </div>
        <button
          onClick={refetchAll}
          disabled={isRefetching}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors active:scale-95"
        >
          <RefreshCw className={cn("w-3 h-3", isRefetching && "animate-spin")} />
          ធ្វើបច្ចុប្បន្នភាព
        </button>
      </div>

      {/* Message List */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
        {isLoading && !allMessages.length ? (
          <div className="flex flex-col items-center justify-center p-10 gap-3 text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin text-primary/50" />
            <p className="text-sm">កំពុងផ្ទុកទិន្នន័យ...</p>
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Mail className="w-7 h-7 text-muted-foreground opacity-50" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">មិនទាន់មានសំបុត្រ</p>
              <p className="text-xs text-muted-foreground mt-1">សំបុត្រថ្មីនឹងបង្ហាញនៅទីនេះ</p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {allMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={() => setSelectedMessage(msg)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 active:bg-secondary/60 transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(msg.fromAddr)} flex items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-white text-base font-black">{getInitial(msg.fromAddr)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-bold text-foreground truncate pr-2">
                        {msg.fromAddr.split('<')[0].trim() || msg.fromAddr}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {new Date(msg.receivedAt).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground/80 truncate">
                      {msg.headerSubject || "(គ្មានប្រធានបទ)"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      → {msg.toEmail}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-border shrink-0" />
                </button>

                {index < allMessages.length - 1 && (
                  <div className="h-px bg-border/40 ml-[3.75rem]" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
