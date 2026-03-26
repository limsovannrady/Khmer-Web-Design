import developerAvatar from "@assets/IMG_20260326_135108_199_1774507912993.jpg";
import { ChevronRight } from "lucide-react";

export function AboutTab() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-3">
      <p className="text-xs font-bold text-muted-foreground px-1 uppercase tracking-wider">អំពីអ្នកអភិវឌ្ឍ</p>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
        <a
          href="https://t.me/limsovannrady"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/40 active:bg-secondary/60 transition-colors"
        >
          <div className="p-0.5 rounded-full bg-gradient-to-br from-primary to-amber-400 shrink-0">
            <img
              src={developerAvatar}
              alt="LIM SOVANNRADY"
              className="w-10 h-10 rounded-full object-cover border-2 border-card"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">LIM SOVANNRADY</p>
            <p className="text-xs text-muted-foreground">@limsovannrady · Telegram</p>
          </div>
          <ChevronRight className="w-4 h-4 text-border shrink-0" />
        </a>

        <div className="h-px bg-border/40 ml-[3.75rem]" />

        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-lg">🇰🇭</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">គូប៉ុង E-GetS</p>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} · Email បណ្ដោះអាសន្ន</p>
          </div>
        </div>
      </div>
    </div>
  );
}
