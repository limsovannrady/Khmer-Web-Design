import { ArrowLeft, User, Calendar, Clock } from "lucide-react";
import type { EmailMessage } from "@workspace/api-client-react";
import { formatKhmerDate } from "@/lib/utils";

interface EmailViewerProps {
  message: EmailMessage;
  onBack: () => void;
}

export function EmailViewer({ message, onBack }: EmailViewerProps) {
  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-xl shadow-black/5 border border-border/50 overflow-hidden animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="flex-none p-4 md:p-6 border-b border-border/50 bg-background/50 backdrop-blur-sm space-y-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm md:hidden mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> ត្រឡប់ក្រោយ
        </button>
        
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          {message.headerSubject || "(គ្មានប្រធានបទ)"}
        </h2>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ពី</p>
              <p className="font-semibold text-foreground">{message.fromAddr}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">កាលបរិច្ឆេទ</p>
              <p className="font-medium text-foreground">{formatKhmerDate(message.receivedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 md:p-6 overflow-auto bg-white">
        {message.html ? (
          <iframe 
            srcDoc={message.html}
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
            className="w-full h-full min-h-[500px] border-0"
            title="Email content"
          />
        ) : (
          <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed min-h-[500px]">
            {message.text || "គ្មានខ្លឹមសារ"}
          </div>
        )}
      </div>
    </div>
  );
}
