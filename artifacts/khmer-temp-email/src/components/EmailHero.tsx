import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
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
        
        // Convert to Khmer numerals gracefully if desired, or keep standard.
        // For standard UI, standard numbers are usually okay, but we can do a simple map.
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

  return (
    <section className="relative pt-16 pb-12 overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            សេវាកម្មកំពុងដំណើរការ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            អាសយដ្ឋាន <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">អ៊ីម៉ែលបណ្ដោះអាសន្ន</span><br/> របស់អ្នក
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto pb-6">
            ការពារភាពឯកជនរបស់អ្នកពីសារឥតបានការ។ ទទួលសំបុត្រភ្លាមៗដោយមិនចាំបាច់ចុះឈ្មោះ។
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/10 rounded-3xl p-6 md:p-8"
        >
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive space-y-4">
              <AlertTriangle className="w-12 h-12" />
              <p className="font-medium">មានបញ្ហាក្នុងការបង្កើតអ៊ីម៉ែល</p>
              <button 
                onClick={onCreateNew}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
              >
                ព្យាយាមម្ដងទៀត
              </button>
            </div>
          ) : isLoading || !session ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium animate-pulse">កំពុងបង្កើតអ៊ីម៉ែលថ្មី...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="relative group">
                <input 
                  type="text" 
                  readOnly 
                  value={session.email}
                  className="w-full text-center text-2xl md:text-3xl font-bold bg-secondary/50 border-2 border-transparent hover:border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl py-6 px-4 transition-all duration-300 outline-none text-foreground cursor-pointer"
                  onClick={copyToClipboard}
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-white shadow-sm rounded-xl text-muted-foreground hover:text-primary hover:scale-105 active:scale-95 transition-all"
                    title="ចម្លងអ៊ីម៉ែល"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <button
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200"
                >
                  <Copy className="w-5 h-5" />
                  ចម្លងអ៊ីម៉ែល
                </button>
                
                <button
                  onClick={onCreateNew}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  ផ្លាស់ប្ដូរអ៊ីម៉ែល
                </button>
              </div>

              <div className={`flex items-center justify-center gap-2 text-sm font-medium ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Clock className="w-4 h-4" />
                <span>
                  {isExpired ? 'អ៊ីម៉ែលនេះបានផុតកំណត់ហើយ' : `ផុតកំណត់ក្នុងរយៈពេល: ${timeLeft}`}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
