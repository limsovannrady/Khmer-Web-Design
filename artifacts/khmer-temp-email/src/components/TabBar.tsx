import { Mail, List, User } from "lucide-react";

export type TabName = "email" | "list" | "about";

interface TabBarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const tabs = [
  { id: "email" as TabName, label: "Email", Icon: Mail },
  { id: "list" as TabName, label: "បញ្ជី", Icon: List },
  { id: "about" as TabName, label: "អំពី", Icon: User },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              activeTab === id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
