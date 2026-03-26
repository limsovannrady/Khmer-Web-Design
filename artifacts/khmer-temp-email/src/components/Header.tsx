import { Mail } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/90 border-b border-border/30">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-amber-400 flex items-center justify-center shadow-md shadow-primary/20 text-white">
            <Mail className="w-4.5 h-4.5" />
          </div>
          <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
            គូប៉ុង E-GetS
          </span>
        </div>
      </div>
    </header>
  );
}
