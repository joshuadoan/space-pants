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
- **Tabbed Interface**: Filter entities by type (Miners, Asteroids, Space Stores, Space Bars, Space Apartments, All)
- **Entity Cards**: Cards showing entity name, role, current state, and detailed stats/inventory
- **State Visualization**: Visual badges showing entity state (idle, traveling, visiting, transacting)
- **Aggregated Stats**: View total resources across all filtered entities
- **Hide/Show UI**: Toggle UI visibility for a cleaner view

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

### Space Bars
- Social gathering spots
- Named with randomly generated space names
- Stationary structures

### Space Apartments
- Residential buildings
- Named with randomly generated space names
- Stationary structures

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
- **Vite v7.2.4** - Build tool and dev server

### UI & Styling
- **TailwindCSS v4.1.17** - Utility-first CSS framework
- **DaisyUI v5.5.5** - Component library for TailwindCSS
- **@tabler/icons-react v3.35.0** - Icon library

### State Management & Performance
- **XState v5.24.0** - State machine library (for entity state management)
- **@tanstack/react-virtual v3.13.13** - Virtual scrolling (available but not actively used)

### UI Components & Utilities
- **react-router v7.11.0** - Client-side routing
- **react-router-dom v7.11.0** - React Router DOM bindings
- **classnames v2.5.1** - Conditional CSS class names
- **motion v12.23.26** - Animation library

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
2. **Explore**: Click on any entity name in the sidebar to zoom the camera to it
3. **Filter**: Use the tabs to filter entities by type (Miners, Asteroids, Space Stores, Space Bars, Space Apartments, All)
4. **Inspect**: Click on an entity to view detailed stats and inventory
5. **Zoom**: Use the zoom slider to adjust camera zoom level
6. **Toggle UI**: Use the "Hide UI" button to toggle UI visibility for a cleaner view

## 🧩 Entity Rules System

Each entity follows a set of logic rules that determine its behavior. Rules are evaluated every 500ms based on the entity's current state.

### Entity States
Entities can be in one of four states:
- **idle**: Entity is not performing any action
- **traveling**: Entity is moving towards a target
- **visiting**: Entity has reached its target and is interacting
- **transacting**: Entity is performing an inventory transaction (adding/removing goods)

### Rule Format
Each rule consists of:
- **name**: Human-readable rule identifier
- **property**: The resource to check (Ore, Money, Products, or Vitals like Health/Energy/Happiness)
- **operator**: Comparison operator (=, <, >, <=, >=, !=)
- **value**: Threshold value to compare against
- **actions**: Array of functions to execute when condition is met

### Rule Evaluation
- Rules are evaluated based on the entity's current state
- Rules are checked every 500ms via a timer
- The first matching rule's actions are executed
- Rules can check inventory (ore, money, products) or stats (health, energy, happiness)

### Current Miner Rules
Miners have rules defined for different states:
- **idle state**: 
  - If Ore < 1 → Travel to random asteroid
  - If Ore ≥ 1 → Travel to random space store
- **visiting state**:
  - If Ore < 1 and visiting asteroid → Mine ore (add 1 ore, remove 1 from asteroid)
  - If Ore ≥ 1 and visiting space store → Trade ore for money (transfer ore to store, receive money)

### Resources & Products
- **Mining Types**: Ore
- **Products**: Gruffle, Fizzy
- **Currency**: Money
- **Vitals**: Health, Energy, Happiness

## 📁 Project Structure

```
space-pants/
├── src/
│   ├── components/          # React UI components
│   │   ├── MeepleDetail.tsx      # Entity detail card component
│   │   ├── MeepleExtraDetail.tsx # Extended entity details (stats/inventory)
│   │   ├── MeeplesList.tsx       # Main entity list with filtering
│   │   ├── Toast.tsx             # Toast notification system
│   │   └── ZoomSlider.tsx        # Camera zoom control
│   ├── entities/             # Game entity classes
│   │   ├── Game.ts           # Excalibur game engine wrapper
│   │   ├── Meeple.ts         # Base entity class with state management
│   │   ├── rules.ts          # Rule evaluation system
│   │   └── types.ts          # Entity type definitions and enums
│   ├── hooks/                # React hooks
│   │   ├── useGame.tsx       # Game initialization and state management
│   │   └── useMeepleFilters.tsx  # Entity filtering logic
│   ├── utils/                # Utility functions
│   │   ├── createStarTilemap.ts  # Star background generation
│   │   ├── generateSpaceName.ts  # Random name generation
│   │   ├── iconMap.ts            # Icon component mapping
│   │   ├── instruction-templates.ts # Instruction templates
│   │   ├── keyboardControls.ts   # Keyboard control utilities
│   │   └── graphics/             # Entity graphics
│   │       ├── index.ts          # Graphics factory
│   │       ├── types.ts          # Graphic style types
│   │       ├── asteroid.ts       # Asteroid graphics
│   │       ├── bartender.ts      # Bartender graphics
│   │       ├── buildings.ts      # Building graphics
│   │       ├── default.ts        # Default ship graphics
│   │       ├── miner.ts          # Miner graphics
│   │       ├── special.ts        # Special entity graphics
│   │       └── trader.ts         # Trader graphics
│   ├── App.tsx               # Main application component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── src_old/                  # Legacy code (old implementation)
├── public/                   # Static assets
├── dist/                     # Production build output
├── docs.md                   # Additional documentation
├── improve.md                # Code improvement notes
├── presentation.md           # Presentation notes
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
Edit `src/hooks/useGame.tsx` to modify:
- World size (`GAME_WIDTH`, `GAME_HEIGHT`) - Default: 2500x2500
- Number of entities (in `COUNTS`):
  - `MINER` - Default: 42
  - `ASTEROID` - Default: 7
  - `SPACE_STORE` - Default: 2
  - `SPACE_BAR` - Default: 2
  - `SPACE_APARTMENT` - Default: 2
- Entity speed range - Default: 50-150 units/second (configurable via `MIN_SHIP_DEFAULT_SPEED` and `MAX_SHIP_DEFAULT_SPEED`)
- Star distribution and spacing (in `src/utils/createStarTilemap.ts`)

### Entity Behavior
- Modify rules in `src/entities/rules.ts` to change entity behavior
- Edit entity state management in `src/entities/Meeple.ts`
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
- Memoized filters and computed values using `useMemo`
- React Router for efficient navigation

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
