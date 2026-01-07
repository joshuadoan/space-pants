# Space Pants

A real-time space economy simulation game built with React, TypeScript, and Excalibur.js. Watch autonomous entities mine, trade, and interact in a dynamic space economy with rule-based AI behavior.

## 🚀 Features

### Core Gameplay
- **Real-time Space Economy Simulation**: Watch miners, space stations, and other entities interact autonomously
- **Entity Management**: View and filter all entities in the game world through an intuitive tabbed interface
- **Rule-Based AI**: Entities follow state-based rules that determine their behavior based on inventory and stats
- **Interactive Camera**: Click on any entity name to zoom and follow it with the camera
- **Zoom Controls**: Adjustable camera zoom slider for better viewing

### Economic Systems
- **Mining System**: Miners extract ore from asteroids
- **Trading System**: Miners sell ore to space stations for money
- **Space Stations**: Trading hubs that accept ore and may produce products
- **Resource Management**: Visual indicators show inventory (ore, money, products) and stats (health, energy, happiness) for each entity

### UI Features
- **Filter Interface**: Filter entities by type (Miners, Asteroids, Space Stores) using radio buttons
- **Entity List**: List view showing entity name, role, current state, and position
- **State Visualization**: Visual indicators showing entity state (idle, traveling, visiting, transacting)
- **Detail View**: Click on any entity to view detailed information including inventory, conditions, and action history
- **Conditions Display**: View all conditions for a selected entity, see which conditions are met, and understand condition evaluation
- **Action History**: Track entity actions and state changes over time with timestamped history entries displayed in reverse chronological order
- **Routing**: Navigate between main list view and individual entity detail pages using React Router

## 🎮 Game Entities

### Miners
- Mine ore from asteroids
- Trade ore for money at space stations
- Rule-based behavior system that evaluates conditions every 500ms
- Default behavior cycle: Mine → Trade
- Rules are evaluated based on state (idle, traveling, visiting, transacting)
- Starting resources: 0 ore, 0 money, 100 health, 100 energy, 100 happiness
- Speed: Random between 50-150 units/second

### Space Stores (Space Stations)
- Stationary trading hubs
- Accept ore from miners
- Handle transactions with visiting entities
- Named with randomly generated space names

### Asteroids
- Source of ore for miners
- Randomly distributed across the world
- Stationary resource nodes
- Named with randomly generated space names

### Stars
- Background decorative elements
- Grid-based distribution across the world
- Creates immersive space atmosphere

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - UI framework with automatic memoization
- **TypeScript** - Type safety and developer experience
- **Excalibur.js v0.31.0** - 2D game engine for entity rendering and physics
- **Vite v7.3.0** - Build tool and dev server

### UI & Styling
- **TailwindCSS v4.1.18** - Utility-first CSS framework
- **DaisyUI v5.5.14** - Component library for TailwindCSS
- **@tabler/icons-react v3.36.0** - Icon library

### State Management & Performance
- **XState v5.25.0** - State machine library (for entity state management)
- **@tanstack/react-virtual v3.13.13** - Virtual scrolling (available but not actively used)

### UI Components & Utilities
- **react-router v7.11.0** - Client-side routing
- **react-router-dom v7.11.0** - React Router DOM bindings
- **classnames v2.5.1** - Conditional CSS class names
- **motion v12.23.26** - Animation library
- **react-markdown v10.1.0** - Markdown rendering

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- pnpm (package manager)

### Setup Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd space-pants
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Start the development server:**
```bash
pnpm dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🏗️ Build & Deployment

### Build for Production
```bash
pnpm build
```

The production build will be output to the `dist/` directory.

### Preview Production Build
```bash
pnpm preview
```

### Linting
```bash
pnpm lint
```

## 🎯 How to Play

1. **Observe**: Watch the autonomous entities go about their business in real-time
2. **Filter**: Use the filter buttons to filter entities by type (Miners, Asteroids, Space Stores)
3. **Explore**: Click on any entity name in the list to navigate to its detail page and zoom the camera to it
4. **Inspect**: View detailed inventory, conditions, and action history for the selected entity
5. **View Conditions**: See all conditions for an entity and which ones are currently met (highlighted in green)
6. **Check History**: Scroll through the action history to see a timeline of entity actions and state changes
7. **Navigate**: Use the back button to return to the main list view

## 🧩 Entity Conditions System

Each entity follows a set of conditions that determine its behavior. Conditions are evaluated periodically based on the entity's current inventory state.

### Entity States
Entities can be in one of four states:
- **idle**: Entity is not performing any action
- **traveling**: Entity is moving towards a target
- **visiting**: Entity has reached its target and is interacting
- **transacting**: Entity is performing an inventory transaction (adding/removing goods)

### Condition Format
Each condition consists of:
- **description**: Human-readable condition description
- **type**: The type of condition (currently supports Inventory)
- **property**: The inventory item to check (stuff, money)
- **operator**: Comparison operator (<, >, >=, <=, !=)
- **quantity**: Threshold value to compare against
- **action**: Function to execute when condition is met

### Condition Evaluation
- Conditions are evaluated periodically via Excalibur Timer (randomized interval between 100-1000ms)
- Conditions are checked when the entity is idle (not performing actions)
- The first matching condition's action is executed
- Conditions check inventory items (stuff, money)

### Current Miner Conditions
Miners have two main conditions:
- **IF_NO_MONEY_MINE_ORE**: If stuff < 1 → Travel to random asteroid, mine ore
- **IF_ORE_SELL_TO_SPACE_STORE**: If stuff ≥ 1 → Travel to space store, sell ore for money

### Space Store Conditions
- **IF_ORE_TURN_INTO_MONEY**: If stuff ≥ 1 → Convert 1 stuff into 2 money (generates profit)

### Asteroid Conditions
- **IF_LOW_ORE_GENERATE_ORE**: If stuff < 100 → Generate 1 stuff (replenishes asteroid resources)

### Resources
- **Stuff**: Ore/material that can be mined and traded
- **Money**: Currency used in transactions

## 📁 Project Structure

```
space-pants/
├── src/
│   ├── components/          # React UI components
│   │   ├── BackButton.tsx        # Navigation back button
│   │   ├── ConditionsDisplay.tsx # Condition visualization component
│   │   ├── Detail.tsx            # Entity detail page component
│   │   ├── HistoryItem.tsx       # Action history item component
│   │   ├── Layout.tsx            # Main layout wrapper with canvas
│   │   ├── Main.tsx              # Main list view component
│   │   ├── MeepleInventoryItemDisplay.tsx # Inventory item display
│   │   ├── MeepleListItem.tsx    # Entity list item component
│   │   └── RoleFilter.tsx        # Entity type filter component
│   ├── Game/                # Game logic and entity classes
│   │   ├── Game.ts          # Excalibur game engine wrapper
│   │   ├── Meeple.ts        # Base entity class with state management
│   │   ├── conditions.ts    # Condition definitions
│   │   └── useGame.tsx      # Game initialization and state management hook
│   ├── utils/                # Utility functions
│   │   ├── createStarTilemap.ts  # Star background generation
│   │   ├── dateUtils.ts          # Date formatting utilities
│   │   ├── generateSpaceName.ts  # Random name generation
│   │   ├── iconMap.ts            # Icon component mapping
│   │   ├── keyboardControls.ts   # Keyboard control utilities
│   │   └── graphics/             # Entity graphics
│   │       ├── index.ts          # Graphics factory
│   │       ├── types.ts          # Graphic style types
│   │       ├── asteroid.ts       # Asteroid graphics
│   │       ├── bartender.ts       # Bartender graphics
│   │       ├── buildings.ts       # Building graphics
│   │       ├── default.ts         # Default ship graphics
│   │       ├── miner.ts           # Miner graphics
│   │       ├── special.ts         # Special entity graphics
│   │       └── trader.ts          # Trader graphics
│   ├── App.tsx               # Main application component with routing
│   ├── main.tsx              # Application entry point
│   ├── types.ts              # Type definitions and enums
│   ├── consts.ts             # Game constants and configuration
│   └── index.css             # Global styles
├── public/                   # Static assets
├── dist/                     # Production build output
├── docs.md                   # Additional documentation
├── improve.md                # Code improvement notes
├── presentation.md            # Presentation notes
├── rule-report.md            # Rule system analysis
├── package.json              # Project dependencies and scripts
├── pnpm-lock.yaml            # Dependency lock file
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TypeScript config
├── tsconfig.node.json        # Node-specific TypeScript config
├── vite.config.ts            # Vite configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # This file
```

## 🎨 Customization

### World Configuration
Edit `src/consts.ts` to modify:
- World size (`GAME_WIDTH`, `GAME_HEIGHT`) - Default: 2500x2500
- Number of entities (in `COUNTS`):
  - `MINER` - Default: 17
  - `ASTEROID` - Default: 7
  - `SPACE_STORE` - Default: 1
- Entity speed range - Default: 50-150 units/second (configurable via `MIN_SHIP_DEFAULT_SPEED` and `MAX_SHIP_DEFAULT_SPEED`)
- Star distribution and spacing (in `src/utils/createStarTilemap.ts`)

### Entity Behavior
- Modify conditions in `src/Game/conditions.ts` to change entity behavior
  - Each condition defines when and how entities act
  - Conditions check inventory state and execute actions
- Edit entity state management in `src/Game/Meeple.ts`
- Customize entity appearance in `src/utils/graphics/`

### Styling
- Modify `src/index.css` for global styles
- Use TailwindCSS classes throughout components
- Customize DaisyUI theme in TailwindCSS configuration

## ⚡ Performance

The game uses React's automatic memoization and efficient state management:
- Game state updates every 500ms
- 50+ entities update simultaneously
- React compares component output automatically
- Only components with changed output re-render
- React 19's automatic memoization optimizes re-renders

### Performance Optimizations
- Viewport culling for stars (only render visible stars)
- Efficient entity state management via Excalibur.js
- React's built-in output comparison prevents unnecessary re-renders
- Game state updates every 500ms to sync with React
- React Router for efficient navigation between views
- Randomized condition evaluation intervals (100-1000ms) to distribute load

## 🐛 Development

### Development Workflow
1. Make changes to source files
2. Hot module replacement (HMR) will automatically update the app
3. Check browser console for errors
4. Use FPS counter to monitor performance

### Code Style
- Follow TypeScript best practices
- Use functional React components
- Follow existing code patterns
- Run `pnpm lint` before committing

### Debugging
- Use browser DevTools for React debugging
- Check Excalibur.js console logs for game engine issues
- Use entity cards to inspect entity state
- Check React DevTools for component re-render analysis

## 🤝 Contributing

This is a private repository. Contributions and collaboration are welcome from authorized contributors.

### How to Contribute

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make your changes
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution

- Bug fixes
- New entity types (Traders, Pirates, Bartenders, etc.)
- UI/UX improvements
- Performance optimizations
- Documentation improvements
- New game mechanics
- Enhanced rule system (editable rules, drag-and-drop)
- New products or resources
- Enhanced visualization features
- Player-controlled entity

## 📝 License

This is a private project. All rights reserved.

## 🙏 Acknowledgments

- Built with [Excalibur.js](https://excaliburjs.com/) game engine
- UI components styled with [DaisyUI](https://daisyui.com/)
- Icons provided by [Tabler Icons](https://tabler.io/icons)

---

Enjoy exploring the space economy! 🚀
