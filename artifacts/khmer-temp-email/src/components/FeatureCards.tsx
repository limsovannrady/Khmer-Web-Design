import { Zap, ShieldCheck, Coins, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "លឿនទាន់ចិត្ត",
    description: "ទទួលសំបុត្រភ្លាមៗ auto-refresh រៀងរាល់ ៥ វិនាទី",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "ឯកជន ១០០%",
    description: "ការពារ Email ពិតរបស់អ្នក — គ្មានការចុះឈ្មោះ",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Coins,
    title: "ឥតគិតថ្លៃ",
    description: "ប្រើប្រាស់ដោយឥតគិតថ្លៃ — គ្មានកាតឥណទាន",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export function FeatureCards() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-6 space-y-3" id="features">
      <p className="text-xs font-bold text-muted-foreground px-1 uppercase tracking-wider">លក្ខណៈពិសេស</p>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
        {features.map((f, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className={`w-10 h-10 rounded-full ${f.bg} flex items-center justify-center shrink-0`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-border shrink-0" />
            </div>
            {i < features.length - 1 && <div className="h-px bg-border/40 ml-[3.75rem]" />}
          </div>
        ))}
      </div>
    </div>
  );
}
