import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { EmailSession } from "@workspace/api-client-react";

interface EmailHeroProps {
  session: EmailSession | null;
  isLoading: boolean;
  error: Error | null;
  onCreateNew: () => void;
}

export function EmailHero({ session, isLoading, error, onCreateNew }: EmailHeroProps) {
  const [timeLeft, setTimeLeft] = useState<string>("១០:០០");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const remaining = new Date(session.expiresAt).getTime() - Date.now();
      if (remaining <= 0) {
        setTimeLeft("០០:០០");
        setIsExpired(true);
        clearInterval(interval);
      } else {
        setIsExpired(false);
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        const k = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];
        const fmt = (n: number) => n.toString().padStart(2,'0').split('').map(d => k[+d]).join('');
        setTimeLeft(`${fmt(minutes)}:${fmt(seconds)}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const copyToClipboard = async () => {
    if (!session?.email) return;
    try {
      await navigator.clipboard.writeText(session.email);
      toast({ title: "បានចម្លង!", description: session.email });
    } catch {
      toast({ title: "បរាជ័យ", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-3">

      {/* Title */}
      <div className="text-center pb-1">
        <p className="text-xs text-muted-foreground font-medium mb-1">Email បណ្ដោះអាសន្ន</p>
        <h2 className="text-2xl font-black text-foreground">
          អ៊ីម៉ែល <span className="text-primary">បណ្ដោះអាសន្ន</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">ការពារ Privacy — ឥតគិតថ្លៃ — ភ្លាមៗ</p>
      </div>

      {/* Email Card */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 gap-3">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-sm font-semibold text-destructive">មានបញ្ហាក្នុងការបង្កើតអ៊ីម៉ែល</p>
            <button onClick={onCreateNew} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold">
              ព្យាយាមម្ដងទៀត
            </button>
          </div>
        ) : isLoading || !session ? (
          <div className="flex flex-col items-center justify-center p-10 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">កំពុងបង្កើតអ៊ីម៉ែល...</p>
          </div>
        ) : (
          <>
            {/* Email Address row */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-secondary/40 transition-colors active:bg-secondary/60 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white text-xs font-black">@</span>
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[11px] text-muted-foreground font-medium">អ៊ីម៉ែលរបស់អ្នក</p>
                  <p className="text-sm font-bold text-foreground truncate">{session.email}</p>
                </div>
              </div>
              <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2 transition-colors" />
            </button>

            <div className="h-px bg-border/50 mx-4" />

            {/* Timer row */}
            <div className={`flex items-center gap-3 px-4 py-3 ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isExpired ? 'bg-destructive/10' : 'bg-secondary'}`}>
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium">{isExpired ? 'ផុតកំណត់ហើយ' : 'ពេលវេលានៅសល់'}</p>
                <p className="text-sm font-bold">{isExpired ? 'ផ្លាស់ប្ដូរអ៊ីម៉ែលថ្មី' : timeLeft}</p>
              </div>
            </div>

            <div className="h-px bg-border/50 mx-4" />

            {/* Action Buttons */}
            <div className="flex gap-2 p-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Copy className="w-4 h-4" />
                ចម្លង
              </button>
              <button
                onClick={onCreateNew}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-bold hover:bg-secondary/70 active:scale-95 transition-all border border-border/50"
              >
                <RefreshCw className="w-4 h-4" />
                ផ្លាស់ប្ដូរ
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
