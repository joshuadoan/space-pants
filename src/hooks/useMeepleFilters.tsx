import { useState, useMemo } from "react";
import { Meeple } from "../entities/Meeple";
import { RoleId } from "../entities/types";

/**
 * Custom hook for filtering meeples by role ID
 *
 * @param meeples - Array of meeples to filter
 * @returns Object containing filtered meeples, active filter, and filter set function
 */
export function useMeepleFilters(meeples: Meeple[]) {
  const [selectedFilter, setSelectedFilter] = useState<RoleId | null>(RoleId.Miner);

  const setFilter = (roleId: RoleId | null) => {
    setSelectedFilter(roleId);
  };

  const filteredMeeples = useMemo(() => {
    if (selectedFilter === null) {
      return meeples;
    }
    return meeples.filter((meeple) => meeple.roleId === selectedFilter);
  }, [meeples, selectedFilter]);

  return {
    filteredMeeples,
    selectedFilter,
    setFilter,
  };
}
