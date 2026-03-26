import { useEffect, useState } from "react";
import { useCreateEmail } from "@workspace/api-client-react";
import { useEmailSession } from "@/hooks/use-email-session";
import { EmailHero } from "@/components/EmailHero";
import { Inbox } from "@/components/Inbox";
import { AboutTab } from "@/components/AboutTab";
import { EmailListTab } from "@/components/EmailListTab";
import { TabBar, type TabName } from "@/components/TabBar";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>("email");
  const { session, saveSession, switchSession, removeFromHistory, history } = useEmailSession();

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

  const handleSwitch = (item: { sessionId: string; email: string; createdAt: string }) => {
    switchSession(item);
    setActiveTab("email");
  };

  return (
    <div className="min-h-screen flex flex-col w-full relative">
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
        {activeTab === "list" && (
          <EmailListTab
            history={history}
            activeSessionId={session?.sessionId ?? null}
            onSwitch={handleSwitch}
            onDelete={removeFromHistory}
          />
        )}
        {activeTab === "about" && <AboutTab />}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
