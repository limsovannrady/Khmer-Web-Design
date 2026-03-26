import { useEffect } from "react";
import { useCreateEmail } from "@workspace/api-client-react";
import { useEmailSession } from "@/hooks/use-email-session";
import { Header } from "@/components/Header";
import { EmailHero } from "@/components/EmailHero";
import { Inbox } from "@/components/Inbox";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { session, saveSession, restoreSession } = useEmailSession();
  
  const { mutate: createEmail, isPending: isCreating, error } = useCreateEmail({
    mutation: {
      onSuccess: (data) => {
        saveSession(data);
      }
    }
  });

  // Create initial session if none exists or if it's expired
  useEffect(() => {
    if (!session && !isCreating && !error) {
      createEmail();
    }
  }, [session, createEmail, isCreating, error]);

  const handleCreateNew = () => {
    createEmail();
  };

  const handleRestore = (sessionId: string) => {
    restoreSession(sessionId);
  };

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <Header />
      
      <main className="flex-1 w-full">
        <EmailHero 
          session={session} 
          isLoading={isCreating} 
          error={error as Error | null}
          onCreateNew={handleCreateNew}
          onRestore={handleRestore}
        />
        
        {session && !isCreating && (
          <Inbox sessionId={session.sessionId} />
        )}
        
      </main>

      <Footer />
    </div>
  );
}