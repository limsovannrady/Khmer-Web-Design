import { useState } from "react";
import { Mail, RefreshCw, Inbox as InboxIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMessages } from "@workspace/api-client-react";
import { EmailViewer } from "./EmailViewer";
import type { EmailMessage } from "@workspace/api-client-react";
import { formatKhmerDate, cn } from "@/lib/utils";

interface InboxProps {
  sessionId: string;
}

export function Inbox({ sessionId }: InboxProps) {
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);

  const { data, isLoading, isRefetching, refetch } = useGetMessages(sessionId, {
    query: {
      refetchInterval: 5000, // Auto-refresh every 5 seconds
      enabled: !!sessionId,
    }
  });

  const messages = data?.messages || [];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12" id="inbox">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <InboxIcon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">ប្រអប់សំបុត្រ</h3>
          <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-bold ml-2">
            {messages.length}
          </span>
        </div>
        
        <button 
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border shadow-sm rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", isRefetching && "animate-spin")} />
          <span className="hidden sm:inline">ធ្វើបច្ចុប្បន្នភាព</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Email List */}
        <div className={cn(
          "lg:col-span-4 lg:flex flex-col gap-3",
          selectedMessage ? "hidden lg:flex" : "flex"
        )}>
          {isLoading && !messages.length ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
              <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary/50" />
              <p>កំពុងផ្ទុកទិន្នន័យ...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-2xl bg-card/50">
              <Mail className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h4 className="text-lg font-bold text-foreground mb-2">មិនទាន់មានសំបុត្រ</h4>
              <p className="text-sm text-muted-foreground">
                អ៊ីម៉ែលដែលអ្នកទទួលបាននឹងបង្ហាញនៅទីនេះ។ យើងកំពុងរង់ចាំ...
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all duration-200 border",
                      selectedMessage?.id === msg.id 
                        ? "bg-primary/5 border-primary/30 shadow-md shadow-primary/5 ring-1 ring-primary/20" 
                        : "bg-card border-border/50 shadow-sm hover:shadow-md hover:border-border"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-foreground truncate pr-2">
                        {msg.fromAddr.split('<')[0] || msg.fromAddr}
                      </p>
                      <span className="text-[11px] font-medium text-muted-foreground shrink-0 mt-1">
                        {new Date(msg.receivedAt).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground/90 truncate mb-1">
                      {msg.headerSubject || "(គ្មានប្រធានបទ)"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {msg.text?.substring(0, 60) || "ចុចដើម្បីមើលខ្លឹមសារ..."}
                    </p>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Email Viewer */}
        <div className={cn(
          "lg:col-span-8",
          !selectedMessage ? "hidden lg:block" : "block"
        )}>
          {selectedMessage ? (
            <EmailViewer 
              message={selectedMessage} 
              onBack={() => setSelectedMessage(null)} 
            />
          ) : (
            <div className="h-full hidden lg:flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-card/50 text-muted-foreground">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Mail className="w-10 h-10 text-primary/40" />
              </div>
              <p className="text-lg font-medium">ជ្រើសរើសសំបុត្រដើម្បីអាន</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
