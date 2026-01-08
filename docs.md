# Space Pants - Documentation

## Project Overview
- Real-time space economy simulation
- React 19 + TypeScript + Excalibur.js
- Autonomous entities interact in dynamic economy using rule-based AI

## Current Implementation

### Entities
- **Miners**: Mine ore (stuff) from asteroids → Trade ore for money at space stores. Each miner has a home (random space apartment).
- **Space Stores**: Trading hubs that accept ore from miners, convert it to money, and sell fizzy drinks to bartenders
- **Bartenders**: Purchase fizzy drinks from space stores when inventory is low, then return to their assigned bar to restock it with fizzy drinks. Each bartender has a home (their assigned space bar).
- **Space Bars**: Stationary establishments that receive fizzy drinks from their assigned bartenders. Each bar has one bartender assigned to it.
- **Space Apartments**: Residential buildings that serve as homes for miners
- **Asteroids**: Ore sources for miners that regenerate ore over time

### Entity States
Entities can be in one of four states:
1. **idle**: Not performing any action
2. **traveling**: Moving towards a target entity
3. **visiting**: Has reached target and is interacting
4. **transacting**: Performing inventory transaction (add/remove goods)

### Condition System
- Conditions are evaluated periodically via Excalibur Timer (randomized interval between 100-1000ms)
- Conditions are checked when entities are idle (not performing actions)
- Conditions check inventory items (stuff, money, fizzy)
- First matching condition's action is executed
- Conditions are defined as objects with:
  - Description for human readability
  - Type (currently Inventory)
  - Property to check (stuff, money)
  - Operator (<, >, >=, <=, !=)
  - Quantity threshold
  - Action function to execute
- Conditions can be visualized in the UI with active state highlighting (green when met)

### Interactive Features
- Filter interface with radio buttons to filter entities by type (Miners, Asteroids, Space Stores)
- Click entity name to navigate to detail page and zoom camera to it
- View detailed inventory and conditions for selected entities
- Conditions Display: See all conditions for an entity, which are met (highlighted in green), and condition evaluation
- Action History: Track entity actions and state changes with timestamps displayed in reverse chronological order
- Detail view: Shows inventory, conditions, and action history together
- Routing: Navigate between main list view (`/`) and entity detail pages (`/:meepleId`)

## Architecture

### State Management
- **Game State**: Managed via `useGame` hook with reducer pattern
- **Entity State**: Managed within Excalibur.js Actor system
- **UI State**: Local component state with React hooks

### Game Loop
- Excalibur.js handles rendering and physics
- React handles UI updates
- Game state syncs with React every 500ms
- Entity conditions evaluated independently via randomized timers (100-1000ms intervals)

### Performance Considerations
- React 19's automatic memoization optimizes re-renders
- Only components with changed output re-render
- Viewport culling for background stars
- Efficient entity filtering with `useMemo`

## Tech Stack
- **React 19**: UI framework with automatic memoization
- **TypeScript**: Type safety
- **Excalibur.js v0.31.0**: 2D game engine
- **Vite v7.3.0**: Build tool and dev server
- **TailwindCSS v4.1.18**: Utility-first CSS
- **DaisyUI v5.5.14**: Component library
- **React Router v7.11.0**: Client-side routing
- **XState v5.25.0**: State machine library
- **@tabler/icons-react v3.36.0**: Icon library

## Code Structure

### Key Files
- `src/Game/Meeple.ts`: Base entity class with state management, action history system, and home property
- `src/Game/conditions.ts`: Condition definitions (IF_NO_MONEY_MINE_ORE, IF_ORE_SELL_TO_SPACE_STORE, IF_LOW_FIZZY_DRINK_BUY_FIZZY_DRINK, IF_HIGH_FIZZY_DRINK_RESTOCK_BAR, etc.)
- `src/Game/Game.ts`: Excalibur engine wrapper
- `src/Game/useGame.tsx`: Game initialization and state management hook
- `src/components/Main.tsx`: Main list view component with filtering
- `src/components/Detail.tsx`: Entity detail page component
- `src/components/ConditionsDisplay.tsx`: Component for visualizing entity conditions
- `src/components/HistoryItem.tsx`: Component for displaying action history items
- `src/components/Layout.tsx`: Main layout wrapper with canvas and routing outlet
- `src/types.ts`: Type definitions and enums
- `src/consts.ts`: Game constants and configuration

### Entity Lifecycle
1. Entity created with initial state (idle, empty inventory)
2. Timer starts evaluating conditions with randomized intervals (100-1000ms)
3. Conditions check inventory state when entity is idle
4. Matching condition executes action (travel, visit, transact)
5. State transitions occur via `dispatch()` method
6. Actions and state changes are logged to entity `actionsHistory`
7. React UI updates reflect state changes every 500ms

### Action History System
- Each entity maintains an `actionsHistory` array of actions and state changes
- History entries include:
  - Timestamp of the action
  - Action taken (travel, visit, transact)
  - State after the action (idle, traveling, visiting, transacting)
- History entries are displayed in reverse chronological order (newest first)
- History is limited to the last 100 entries per entity
- Useful for debugging entity behavior and understanding decision history

## Current Entity Counts
- Miners: 17
- Asteroids: 7
- Space Stores: 3
- Space Bars: 2
- Space Apartments: 3
- Bartenders: 2 (one per space bar)

(Configured in `src/consts.ts`)

## Home System
Entities can have a `home` property that points to another entity:
- **Miners**: Assigned to a random space apartment as their home
- **Bartenders**: Assigned to a specific space bar as their home (one bartender per bar)
- The home property is used by conditions to determine where entities should return to (e.g., bartenders restocking their bar)

## Bartender System
Bartenders are autonomous entities that manage fizzy drink inventory for space bars:
- **Buying Phase**: When fizzy drink inventory < 100, bartenders travel to space stores to purchase fizzy drinks
- **Restocking Phase**: When fizzy drink inventory ≥ 1, bartenders return to their home bar and transfer all fizzy drinks to the bar
- Each space bar has exactly one assigned bartender who is responsible for restocking it
- Bartenders use the `home` property to know which bar they should restock

## Future Enhancements
- Editable conditions system with UI
- Additional entity types (Traders, Pirates)
- Customers for bars (entities that consume fizzy drinks)
- More complex bar economics (pricing, profit margins)
- Player-controlled entity
- More complex economic interactions
- Save/load game state
- Enhanced visualization features
- Action history export/analysis features
- Additional condition types (beyond Inventory)
- More sophisticated operators and condition logic
