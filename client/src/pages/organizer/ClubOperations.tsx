import { useState } from "react";
import { CreateClub, MyClubs, Clubs } from "@/features/clubs";

const tabs = [
  { key: "all", label: "All clubs" },
  { key: "mine", label: "My clubs" },
  { key: "create", label: "Create club" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const ClubOperations = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("mine");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Club operations
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Create and manage the clubs you run.
      </p>

      <div
        role="tablist"
        className="mt-6 inline-flex gap-1 rounded-lg border border-border bg-surface-muted p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        {activeTab === "create" && (
          <>
            <h2 className="text-lg font-semibold text-ink">Create a club</h2>
            <p className="mt-1 text-sm text-ink-soft">
              You'll be added as the club's manager automatically.
            </p>
            <div className="mt-4">
              <CreateClub onCreated={() => setActiveTab("mine")} />
            </div>
          </>
        )}
        {activeTab === "mine" && <MyClubs />}
        {activeTab === "all" && <Clubs />}
      </div>
    </div>
  );
};

export default ClubOperations;
