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

  const [switchToListAfterCreate, setSwitchToListAfterCreate] = useState(false);

  const { mutate: createEmail, isPending: isCreating, error } = useCreateEmail({
    mutation: {
      onSuccess: (data) => {
        saveSession(data);
        if (switchToListAfterCreate) {
          setActiveTab("list");
          setSwitchToListAfterCreate(false);
        }
      }
    }
  });

  useEffect(() => {
    if (!session && !isCreating && !error) {
      createEmail();
    }
  }, [session, createEmail, isCreating, error]);

  const handleCreateNew = () => {
    setSwitchToListAfterCreate(true);
    createEmail();
  };

  const handleDelete = (sessionId: string) => {
    removeFromHistory(sessionId);
    setSwitchToListAfterCreate(true);
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
            {history.length > 0 && !isCreating && (
              <Inbox sessions={history} />
            )}
          </>
        )}
        {activeTab === "list" && (
          <EmailListTab
            history={history}
            activeSessionId={session?.sessionId ?? null}
            onSwitch={handleSwitch}
            onDelete={handleDelete}
          />
        )}
        {activeTab === "about" && <AboutTab />}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
