# Space Pants - Documentation

## Project Overview
- Real-time space economy simulation
- React 19 + TypeScript + Excalibur.js
- Autonomous entities interact in dynamic economy using rule-based AI

## Current Implementation

### Entities
- **Miners**: Mine ore from asteroids → Trade ore for money at space stores
- **Space Stores**: Trading hubs that accept ore from miners
- **Space Bars**: Social gathering spots (currently static)
- **Space Apartments**: Residential buildings (currently static)
- **Asteroids**: Ore sources for miners

### Entity States
Entities can be in one of four states:
1. **idle**: Not performing any action
2. **traveling**: Moving towards a target entity
3. **visiting**: Has reached target and is interacting
4. **transacting**: Performing inventory transaction (add/remove goods)

### Rule System
- Rules are evaluated every 500ms via Excalibur Timer
- Rules are state-based (different rules for idle, traveling, visiting, transacting)
- Rules check inventory (ore, money, products) or stats (health, energy, happiness)
- First matching rule's actions are executed
- Two types of rules:
  - **RULES**: Behavior rules that control entity actions (travel, visit, transact)
  - **GENERATORS**: Resource generation rules that create resources over time
- Rules can be visualized in the UI with active state highlighting

### Interactive Features
- Tabbed interface to filter entities by type
- Click entity name to zoom camera to it
- View detailed stats and inventory for selected entities
- Rules Visualizer: See all rules for an entity, which are active, and condition evaluation
- Journal System: Track entity actions and state changes with timestamps
- Detail tabs: Switch between Stats, Rules, and Journal views
- Zoom slider for camera control
- Hide/Show UI toggle
- Aggregated resource stats in navigation bar

## Architecture

### State Management
- **Game State**: Managed via `useGame` hook with reducer pattern
- **Entity State**: Managed within Excalibur.js Actor system
- **UI State**: Local component state with React hooks

### Game Loop
- Excalibur.js handles rendering and physics
- React handles UI updates
- Game state syncs with React every 500ms
- Entity rules evaluated independently via timers

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
- `src/entities/Meeple.ts`: Base entity class with state management and journal system
- `src/rules/rules.ts`: Rule definitions (RULES and GENERATORS) and evaluation system
- `src/entities/Game.ts`: Excalibur engine wrapper
- `src/hooks/useGame.tsx`: Game initialization and state
- `src/components/MeeplesList.tsx`: Main UI component with filtering and detail views
- `src/components/RulesVisualizer.tsx`: Component for visualizing entity rules
- `src/components/JournalVisualizer.tsx`: Component for viewing entity action history

### Entity Lifecycle
1. Entity created with initial state (idle, empty inventory)
2. Timer starts evaluating rules every 500ms
3. Rules check conditions based on current state
4. Matching rule executes actions (travel, visit, transact)
5. State transitions occur via `dispatch()` method
6. Actions and state changes are logged to entity journal
7. React UI updates reflect state changes

### Journal System
- Each entity maintains a journal of actions and state changes
- Journal entries include:
  - Timestamp of the action
  - Previous state before action
  - Action taken (travel-to, visit, finish, transact-inventory)
- Journal entries are displayed in reverse chronological order (newest first)
- Useful for debugging entity behavior and understanding decision history

## Current Entity Counts
- Miners: 42
- Asteroids: 17
- Space Stores: 4
- Space Bars: 2
- Space Apartments: 2

## Future Enhancements
- Editable rules system with UI
- Additional entity types (Traders, Pirates, Bartenders)
- Player-controlled entity
- More complex economic interactions
- Save/load game state
- Enhanced visualization features
- Journal export/analysis features
