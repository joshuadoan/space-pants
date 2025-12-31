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
};

type JournalEntryItemProps = {
  entry: JournalEntry;
  isNew: boolean;
};

const JournalEntryItem = ({ entry, isNew }: JournalEntryItemProps) => {
  const formattedEntry = formatJournalEntry(entry);
  const { displayedText, isTyping } = useTypewriter(formattedEntry.text, 30, isNew);

  return (
    <div className="p-2 border-b border-base-300 last:border-b-0">
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
  const [newEntryTimestamps, setNewEntryTimestamps] = useState<Set<number>>(new Set());

  // Detect new entries
  useEffect(() => {
    const newTimestamps = new Set<number>();
    journal.forEach((entry) => {
      if (!seenTimestampsRef.current.has(entry.timestamp)) {
        newTimestamps.add(entry.timestamp);
        seenTimestampsRef.current.add(entry.timestamp);
      }
    });

    if (newTimestamps.size > 0) {
      setNewEntryTimestamps(newTimestamps);
      // Clear the "new" flag after animation completes (roughly 30ms * text length)
      // Calculate max length only for new entries
      const newEntries = journal.filter(e => newTimestamps.has(e.timestamp));
      const maxTextLength = newEntries.length > 0 
        ? Math.max(...newEntries.map(e => formatJournalEntry(e).text.length))
        : 0;
      const timer = setTimeout(() => {
        setNewEntryTimestamps(prev => {
          const updated = new Set(prev);
          newTimestamps.forEach(ts => updated.delete(ts));
          return updated;
        });
      }, maxTextLength * 30 + 1000); // Add more buffer time
      return () => clearTimeout(timer);
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
    <div className={cx("flex flex-col gap-2 p-2", className)}>
      <div className="text-xs text-gray-500 mb-2">
        Showing {journal.length} {journal.length === 1 ? "entry" : "entries"}{" "}
        (newest first)
      </div>
      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
        {sortedJournal.map((entry) => {
          const isNew = newEntryTimestamps.has(entry.timestamp);
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
