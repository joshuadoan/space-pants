import { useState, useMemo } from "react";
import { Meeple } from "../entities/Meeple";
import { RoleId } from "../entities/types";

/**
 * Custom hook for filtering meeples by role ID
 * 
 * @param meeples - Array of meeples to filter
 * @returns Object containing filtered meeples, active filters, and filter toggle function
 */
export function useMeepleFilters(meeples: Meeple[]) {
  const [filters, setFilters] = useState<RoleId[]>([]);

  const toggleFilter = (roleId: RoleId) => {
    setFilters((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const filteredMeeples = useMemo(() => {
    if (filters.length === 0) {
      return meeples;
    }
    return meeples.filter((meeple) => filters.includes(meeple.roleId));
  }, [meeples, filters]);

  return {
    filteredMeeples,
    filters,
    toggleFilter,
  };
}

