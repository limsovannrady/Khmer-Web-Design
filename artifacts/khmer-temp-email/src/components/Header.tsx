import { Mail } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-amber-400 flex items-center justify-center shadow-lg shadow-primary/20 text-white">
            <Mail className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 hidden sm:block">
            ដ្រម៉ែល
          </h1>
        </div>
        <nav className="flex items-center gap-8 text-base font-bold text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">លក្ខណៈពិសេស</a>
          <a href="#about" className="hover:text-primary transition-colors">អំពីអ្នកអភិវឌ្ឍ</a>
        </nav>
      </div>
    </header>
  );
}