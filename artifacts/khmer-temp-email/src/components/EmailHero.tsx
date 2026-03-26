import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Clock, AlertTriangle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import type { EmailSession } from "@workspace/api-client-react";

interface EmailHeroProps {
  session: EmailSession | null;
  isLoading: boolean;
  error: Error | null;
  onCreateNew: () => void;
  onRestore: (sessionId: string) => void;
}

export function EmailHero({ session, isLoading, error, onCreateNew, onRestore }: EmailHeroProps) {
  const [timeLeft, setTimeLeft] = useState<string>("១០:០០");
  const [isExpired, setIsExpired] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [restoreSessionId, setRestoreSessionId] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);

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
        
        const khmerNums = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];
        const formatNum = (num: number) => 
          num.toString().padStart(2, '0').split('').map(d => khmerNums[parseInt(d)]).join('');
          
        setTimeLeft(`${formatNum(minutes)}:${formatNum(seconds)}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const copyToClipboard = async () => {
    if (!session?.email) return;
    try {
      await navigator.clipboard.writeText(session.email);
      toast({
        title: "បានចម្លងដោយជោគជ័យ",
        description: "អាសយដ្ឋានអ៊ីម៉ែលត្រូវបានចម្លងទៅក្ដារតម្បៀតខ្ទាស់។",
      });
    } catch (err) {
      toast({
        title: "បរាជ័យ",
        description: "មិនអាចចម្លងអ៊ីម៉ែលបានទេ។",
        variant: "destructive"
      });
    }
  };

  const handleRestore = async () => {
    if (!restoreSessionId.trim()) return;
    setIsRestoring(true);
    try {
      const res = await fetch(`/api/email/${restoreSessionId}/messages`);
      if (!res.ok) throw new Error("Invalid session");
      onRestore(restoreSessionId.trim());
      setIsRestoreOpen(false);
      setRestoreSessionId("");
      toast({
        title: "បានស្ដារដោយជោគជ័យ",
        description: "គណនីចាស់របស់អ្នកត្រូវបានស្ដារ។"
      });
    } catch (e) {
      toast({
        title: "បរាជ័យក្នុងការស្ដារ",
        description: "Session ID មិនត្រឹមត្រូវ ឬបានផុតកំណត់",
        variant: "destructive"
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-bold mb-4 shadow-sm border border-primary/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            សេវាកម្មកំពុងដំណើរការ
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-tight">
            អាសយដ្ឋាន <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">អ៊ីម៉ែលបណ្ដោះអាសន្ន</span><br/> របស់អ្នក
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto pb-8 font-medium">
            ការពារភាពឯកជនរបស់អ្នកពីសារឥតបានការ។ ទទួលសំបុត្រភ្លាមៗដោយមិនចាំបាច់ចុះឈ្មោះ។
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border-2 border-border shadow-2xl shadow-black/50 rounded-[2.5rem] p-8 md:p-12 mb-8 relative z-10"
        >
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-destructive space-y-6">
              <AlertTriangle className="w-16 h-16" />
              <p className="text-2xl font-bold">មានបញ្ហាក្នុងការបង្កើតអ៊ីម៉ែល</p>
              <button 
                onClick={onCreateNew}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-transform"
              >
                ព្យាយាមម្ដងទៀត
              </button>
            </div>
          ) : isLoading || !session ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <p className="text-xl text-muted-foreground font-bold animate-pulse">កំពុងបង្កើតអ៊ីម៉ែលថ្មី...</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="relative group">
                <input 
                  type="text" 
                  readOnly 
                  value={session.email}
                  className="w-full text-center text-2xl md:text-3xl lg:text-4xl font-black bg-background border-4 border-secondary hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-[2rem] py-8 px-6 transition-all duration-300 outline-none text-foreground cursor-pointer"
                  onClick={copyToClipboard}
                />
                <div className="absolute inset-y-0 right-6 flex items-center">
                  <button 
                    onClick={copyToClipboard}
                    className="p-4 bg-secondary shadow-md rounded-2xl text-foreground hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all"
                    title="ចម្លងអ៊ីម៉ែល"
                  >
                    <Copy className="w-7 h-7" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <button
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xl bg-gradient-to-r from-orange-500 to-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                >
                  <Copy className="w-6 h-6" />
                  ចម្លងអ៊ីម៉ែល
                </button>
                
                <button
                  onClick={onCreateNew}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xl bg-secondary text-foreground hover:bg-secondary/80 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 border-2 border-transparent hover:border-border"
                >
                  <RefreshCw className="w-6 h-6" />
                  ផ្លាស់ប្ដូរអ៊ីម៉ែល
                </button>
              </div>

              <div className={`flex items-center justify-center gap-3 text-lg font-bold ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Clock className="w-6 h-6" />
                <span>
                  {isExpired ? 'អ៊ីម៉ែលនេះបានផុតកំណត់ហើយ' : `ផុតកំណត់ក្នុងរយៈពេល: ${timeLeft}`}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Restore Section */}
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setIsRestoreOpen(!isRestoreOpen)}
            className="flex items-center justify-center gap-2 mx-auto text-lg font-bold text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-xl hover:bg-secondary"
          >
            🔄 ស្ដារអ៊ីម៉ែលចាស់
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isRestoreOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isRestoreOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card border-2 border-border rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-4 shadow-xl">
                  <input 
                    type="text"
                    placeholder="បញ្ចូល Session ID ចាស់របស់អ្នក..."
                    value={restoreSessionId}
                    onChange={(e) => setRestoreSessionId(e.target.value)}
                    className="flex-1 bg-background border-2 border-secondary rounded-2xl px-6 py-4 text-lg font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button 
                    onClick={handleRestore}
                    disabled={isRestoring || !restoreSessionId.trim()}
                    className="px-8 py-4 bg-foreground text-background font-black rounded-2xl text-lg hover:bg-foreground/90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isRestoring ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    ស្ដារ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}