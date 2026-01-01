import type { MeepleState, MeepleAction } from "../entities/Meeple";
import cx from "classnames";
import { formatRelativeTime } from "../utils/dateUtils";
import { formatJournalEntry } from "../utils/journalUtils";
import { useTypewriter } from "../hooks/useTypewriter";
import { useEffect, useRef, useState } from "react";
import { IconComponent } from "../utils/iconMap";

type JournalEntry = {
  timestamp: number;
  state: MeepleState;
  action: MeepleAction;
  source?: "rule" | "generator";
};

type JournalEntryItemProps = {
  entry: JournalEntry;
  isNew: boolean;
};

const JournalEntryItem = ({ entry, isNew }: JournalEntryItemProps) => {
  const formattedEntry = formatJournalEntry(entry);
  const { displayedText, isTyping } = useTypewriter(formattedEntry.text, 30, isNew);

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 shrink-0">
          {formattedEntry.icons.map((icon, idx) => (
            <IconComponent 
              key={idx} 
              icon={icon as any} 
              size={16} 
              className="text-base-content/70" 
            />
          ))}
        </div>
        <p className="text-sm font-medium flex-1">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(entry.timestamp)}</p>
    </div>
  );
};

export const JournalVisualizer = ({ journal, className }: { journal: JournalEntry[], className?: string }) => {
  const seenTimestampsRef = useRef<Set<number>>(new Set());
  const [latestEntryTimestamp, setLatestEntryTimestamp] = useState<number | null>(null);

  // Detect new entries and only animate the latest one
  useEffect(() => {
    if (journal.length === 0) {
      setLatestEntryTimestamp(null);
      return;
    }

    // Find the latest entry (highest timestamp)
    const latestEntry = journal.reduce((latest, entry) => 
      entry.timestamp > latest.timestamp ? entry : latest
    );

    // Check if this is a new entry we haven't seen before
    const isNewEntry = !seenTimestampsRef.current.has(latestEntry.timestamp);
    
    if (isNewEntry) {
      seenTimestampsRef.current.add(latestEntry.timestamp);
      setLatestEntryTimestamp(latestEntry.timestamp);
      
      // Clear the "new" flag after animation completes
      const formattedEntry = formatJournalEntry(latestEntry);
      const timer = setTimeout(() => {
        setLatestEntryTimestamp(null);
      }, formattedEntry.text.length * 30 + 1000);
      return () => clearTimeout(timer);
    } else {
      // If it's not a new entry, don't animate
      setLatestEntryTimestamp(null);
    }
  }, [journal]);

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
    <div className={cx("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
        {sortedJournal.map((entry) => {
          // Only animate the latest entry
          const isNew = latestEntryTimestamp === entry.timestamp;
          return (
            <JournalEntryItem
              key={entry.timestamp}
              entry={entry}
              isNew={isNew}
            />
          );
        })}
      </div>
    </div>
  );
};
