import { useEffect, useState } from "react";
import { useCreateEmail } from "@workspace/api-client-react";
import { useEmailSession } from "@/hooks/use-email-session";
import { Header } from "@/components/Header";
import { EmailHero } from "@/components/EmailHero";
import { Inbox } from "@/components/Inbox";
import { AboutTab } from "@/components/AboutTab";
import { TabBar } from "@/components/TabBar";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"email" | "about">("email");
  const { session, saveSession } = useEmailSession();

  const { mutate: createEmail, isPending: isCreating, error } = useCreateEmail({
    mutation: {
      onSuccess: (data) => {
        saveSession(data);
      }
    }
  });

  useEffect(() => {
    if (!session && !isCreating && !error) {
      createEmail();
    }
  }, [session, createEmail, isCreating, error]);

  const handleCreateNew = () => {
    createEmail();
  };

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <Header />

      <main className="flex-1 w-full pb-20">
        {activeTab === "email" && (
          <>
            <EmailHero
              session={session}
              isLoading={isCreating}
              error={error as Error | null}
              onCreateNew={handleCreateNew}
            />
            {session && !isCreating && (
              <Inbox sessionId={session.sessionId} />
            )}
          </>
        )}
        {activeTab === "about" && <AboutTab />}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
