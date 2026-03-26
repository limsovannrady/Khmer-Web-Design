import { Mail, User } from "lucide-react";

interface TabBarProps {
  activeTab: "email" | "about";
  onTabChange: (tab: "email" | "about") => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto flex">
        <button
          onClick={() => onTabChange("email")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
            activeTab === "email" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-bold">Email</span>
        </button>
        <button
          onClick={() => onTabChange("about")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
            activeTab === "about" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">អំពី</span>
        </button>
      </div>
    </div>
  );
}
