import type { MeepleState, MeepleAction } from "../entities/Meeple";

type JournalEntry = {
  timestamp: number;
  state: MeepleState;
  action: MeepleAction;
};

export const JournalVisualizer = ({ journal }: { journal: JournalEntry[] }) => {
  if (journal.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 text-sm">No journal entries yet</p>
      </div>
    );
  }

  // Show newest entries first
  const sortedJournal = [...journal].reverse();

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="text-xs text-gray-500 mb-2">
        Showing {journal.length} {journal.length === 1 ? "entry" : "entries"}{" "}
        (newest first)
      </div>
      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
        {sortedJournal.map((entry, index) => {
          return (
            <div key={index}>
              <p>{entry.action.name}</p>
              <p>{entry.state.name}</p>
              <p>{entry.timestamp}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
