# Camera Lock Feature Plan

## Overview
Add the ability to "lock" the camera to either player control or meeple following mode, preventing automatic switching when selecting/deselecting meeples.

## Current Behavior
- Camera automatically switches to "meeple" mode when a meeple is selected
- Camera automatically switches to "player" mode when no meeple is selected
- This happens in `Layout.tsx` via a `useEffect` that watches `selectedMeeple`

## Proposed Changes

### 1. Add Lock State to Game Context (`useGame.tsx`)

**Add to state:**
- `cameraLocked: boolean` - tracks whether camera mode is locked
- `cameraLockMode: "player" | "meeple" | null` - stores which mode is locked (optional, could derive from `cameraControl` if locked)

**Add to context:**
- `setCameraLocked: (locked: boolean) => void` - function to toggle lock state
- Or alternatively: `setCameraLockMode: (mode: "player" | "meeple" | null) => void`

**Add action type:**
- `GameActionSetCameraLock` with `locked: boolean` or `mode: "player" | "meeple" | null`

### 2. Modify Auto-Switch Logic (`Layout.tsx`)

**Update the `useEffect` (lines 31-37):**
- Only auto-switch camera control when `cameraLocked === false` (or `cameraLockMode === null`)
- When locked, preserve the current `cameraControl` mode regardless of `selectedMeeple` changes
- When unlocking, allow the normal auto-switch behavior to resume

**Logic:**
```typescript
useEffect(() => {
  if (cameraLocked) {
    // Don't auto-switch if locked
    return;
  }
  
  if (!!selectedMeeple) {
    setCameraControl("meeple");
  } else {
    setCameraControl("player");
  }
}, [selectedMeeple, cameraLocked]);
```

### 3. Add UI Controls (`Layout.tsx`)

**Make camera status badge interactive:**
- Add click handler to toggle lock state
- Add lock icon (`IconLock` / `IconLockOpen` from `@tabler/icons-react`)
- Show lock icon when camera is locked
- Visual indicator (different color/border) when locked

**UI Updates:**
- Add lock icon next to camera status text
- Change badge styling when locked (e.g., thicker border, different opacity)
- Add hover state to indicate clickability
- Add tooltip explaining lock behavior

### 4. Optional Enhancements

**Keyboard shortcut:**
- Add keyboard shortcut (e.g., `L` key) to toggle camera lock
- Implement in `keyboardControls.ts` or add separate keyboard handler

**Auto-unlock behavior:**
- Consider auto-unlocking when user explicitly switches modes via UI
- Or provide explicit unlock button/action

**Tooltip/Help text:**
- Add tooltip explaining what "locked" means
- Explain that locked mode prevents auto-switching

## Benefits

1. **User Control**: Users can maintain player control even when viewing meeple details
2. **Flexibility**: Users can lock to meeple following mode and browse other meeples without losing the camera lock
3. **Better UX**: Prevents unexpected camera movements when interacting with the UI

## Implementation Order

1. Add lock state to `useGame.tsx` context
2. Update auto-switch logic in `Layout.tsx`
3. Add UI controls (clickable badge with lock icon)
4. Add optional enhancements (keyboard shortcut, tooltips)

## Files to Modify

- `src/Game/useGame.tsx` - Add lock state and actions
- `src/components/Layout.tsx` - Update auto-switch logic and add UI controls
- `src/utils/keyboardControls.ts` (optional) - Add keyboard shortcut
