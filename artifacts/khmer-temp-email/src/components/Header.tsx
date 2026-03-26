import { Mail } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-amber-400 flex items-center justify-center shadow-lg shadow-primary/20 text-white">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 hidden sm:block">
            ដ្រម៉ែល
          </h1>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">លក្ខណៈពិសេស</a>
          <a href="#about" className="hover:text-primary transition-colors">អំពីអ្នកអភិវឌ្ឍ</a>
        </nav>
      </div>
    </header>
  );
}
