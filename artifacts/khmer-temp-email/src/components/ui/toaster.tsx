import { useToast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`
              pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border
              ${toast.variant === "destructive" 
                ? "bg-destructive text-destructive-foreground border-destructive/20 shadow-destructive/20" 
                : "bg-card text-foreground border-border/50 shadow-black/5"
              }
            `}
          >
            {toast.variant === "destructive" ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            <div>
              {toast.title && <p className="font-semibold">{toast.title}</p>}
              {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
