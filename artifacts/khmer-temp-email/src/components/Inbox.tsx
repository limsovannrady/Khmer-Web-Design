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
    <section className="max-w-6xl mx-auto px-4 py-16 lg:py-24" id="inbox">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <InboxIcon className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black text-foreground">ប្រអប់សំបុត្រ</h3>
          <span className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-lg font-black ml-2 shadow-lg shadow-primary/20">
            {messages.length}
          </span>
        </div>
        
        <button 
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-3 px-6 py-3 bg-secondary text-secondary-foreground border border-border shadow-md rounded-xl text-base font-bold hover:bg-secondary/80 transition-colors disabled:opacity-50 active:scale-95"
        >
          <RefreshCw className={cn("w-5 h-5", isRefetching && "animate-spin")} />
          <span>ធ្វើបច្ចុប្បន្នភាព</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
        {/* Email List */}
        <div className={cn(
          "lg:col-span-5 lg:flex flex-col gap-4",
          selectedMessage ? "hidden lg:flex" : "flex"
        )}>
          {isLoading && !messages.length ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-card/30">
              <RefreshCw className="w-10 h-10 animate-spin mb-4 text-primary/50" />
              <p className="text-lg font-medium">កំពុងផ្ទុកទិន្នន័យ...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-3xl bg-card/30">
              <Mail className="w-16 h-16 text-muted-foreground mb-6 opacity-40" />
              <h4 className="text-2xl font-bold text-foreground mb-3">មិនទាន់មានសំបុត្រ</h4>
              <p className="text-base text-muted-foreground max-w-xs">
                អ៊ីម៉ែលដែលអ្នកទទួលបាននឹងបង្ហាញនៅទីនេះ។ យើងកំពុងរង់ចាំ...
              </p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[900px] pr-2 custom-scrollbar">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl transition-all duration-300 border-2",
                      selectedMessage?.id === msg.id 
                        ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                        : "bg-card border-border shadow-sm hover:border-primary/50 hover:shadow-md"
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-bold text-lg text-foreground truncate pr-4">
                        {msg.fromAddr.split('<')[0] || msg.fromAddr}
                      </p>
                      <span className="text-sm font-bold text-muted-foreground shrink-0 bg-secondary px-2 py-1 rounded-md">
                        {new Date(msg.receivedAt).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-base font-bold text-foreground/90 truncate mb-2">
                      {msg.headerSubject || "(គ្មានប្រធានបទ)"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate font-medium">
                      {msg.text?.substring(0, 80) || "ចុចដើម្បីមើលខ្លឹមសារ..."}
                    </p>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Email Viewer */}
        <div className={cn(
          "lg:col-span-7",
          !selectedMessage ? "hidden lg:block" : "block"
        )}>
          {selectedMessage ? (
            <EmailViewer 
              message={selectedMessage} 
              onBack={() => setSelectedMessage(null)} 
            />
          ) : (
            <div className="h-full hidden lg:flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-card/30 text-muted-foreground">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Mail className="w-12 h-12 text-primary/40" />
              </div>
              <p className="text-xl font-bold">ជ្រើសរើសសំបុត្រដើម្បីអាន</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}