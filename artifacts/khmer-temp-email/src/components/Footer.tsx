import developerAvatar from "@assets/IMG_20260326_135108_199_1774507912993.jpg";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-auto border-t-4 border-primary" id="about">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
        
        <div className="mb-8 p-1 rounded-full bg-gradient-to-br from-primary via-orange-400 to-amber-300 shadow-xl">
          <img 
            src={developerAvatar} 
            alt="LIM SOVANNRADY" 
            className="w-24 h-24 rounded-full object-cover border-4 border-foreground"
          />
        </div>

        <h3 className="text-2xl font-bold mb-2">LIM SOVANNRADY</h3>
        <p className="text-muted-foreground text-sm font-medium mb-6 uppercase tracking-widest">
          Software Developer
        </p>

        <a 
          href="https://t.me/limsovannrady" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2AABEE]/10 text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white rounded-full font-semibold transition-all duration-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.21 3.45-.49.34-.94.51-1.35.5-.45-.01-1.31-.25-1.96-.46-.8-.26-1.43-.4-1.37-.85.03-.23.34-.47.93-.72 3.65-1.59 6.08-2.61 7.29-3.03 3.47-1.2 4.19-1.45 4.67-1.46.11 0 .34.02.5.14.13.1.18.25.19.39.01.12.01.25 0 .36z"/>
          </svg>
          @limsovannrady
        </a>

        <div className="mt-12 w-full max-w-md h-px bg-white/10" />
        
        <p className="mt-8 text-white/50 flex items-center gap-2 text-sm font-medium">
          បង្កើតឡើងដោយក្ដីស្រលាញ់ <Heart className="w-4 h-4 text-destructive fill-destructive" /> សម្រាប់ប្រជាជនកម្ពុជា
        </p>
        <p className="mt-2 text-white/30 text-xs">
          © {new Date().getFullYear()} ដ្រម៉ែល. រក្សាសិទ្ធិគ្រប់យ៉ាង។
        </p>
      </div>
    </footer>
  );
}
