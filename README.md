# Space Pants

A real-time space economy simulation game built with React, TypeScript, and Excalibur.js. Watch autonomous entities mine, trade, socialize, and interact in a dynamic space economy with customizable behavior rules.

![Zight Recording 2025-12-12 at 08 25 38 AM](https://github.com/user-attachments/assets/4c30ae58-b49b-43ea-af79-4fd282f5a193)

## 🚀 Features

### Core Gameplay
- **Real-time Space Economy Simulation**: Watch miners, traders, space stations, and other entities interact autonomously
- **Entity Management**: View and manage all entities in the game world through an intuitive tabbed interface
- **Customizable Behavior**: Edit logic rules for entities to control their actions based on resource conditions
- **Drag-and-Drop Rule Reordering**: Reorder entity rules by dragging them in the rules editor to change priority
- **Interactive Camera**: Click on any entity name to zoom and follow it with the camera
- **FPS Monitoring**: Real-time performance metrics displayed on screen

### Economic Systems
- **Dynamic Production**: Space stations convert ore into various products (Gruffle, Druffle, Klintzpaw, Grogin, Fizz) at a rate of 1 product per 1 ore, with production checks every 0.5 seconds
- **Trading System**: Entities buy and sell goods at space stations
- **Social System**: Entities visit space bars and space apartments to socialize and spend money
- **Resource Management**: Visual indicators show goods carried by entities (followers display goods quantities)

### UI Features
- **Tabbed Interface**: Filter entities by type (Traders, Miners, Stations, Space Bars, Space Apartments, Asteroids, Player, All)
- **Entity Cards**: Expandable cards showing entity stats, goods, and editable rules
- **Built-in Documentation**: View the README directly in the app via the Readme tab
- **Toast Notifications**: Visual feedback for rule updates and entity actions

## 🎮 Game Entities

### Player
- Controllable character that can move around the space world
- Starts with 0 money
- Keyboard controls: WASD or Arrow keys
- Camera automatically follows the player
- Speed: 100 units/second (configurable via `DEFAULT_SHIP_SPEED`)

### Miners
- Mine ore from asteroids
- Trade ore for money at space stations
- Visit space bars when they have enough money (≥50)
- Default behavior cycle: Mine → Trade → Socialize
- Default rules:
  - If Money ≥ 50 → Socialize
  - If Ore ≤ 0 → Mine Ore
  - If Ore ≥ 10 → Trade Ore For Money

### Traders
- Buy products from space stations when they have money
- Sell products to space stations when they run out of money
- Start with 10 money
- Default rules:
  - If Money > 0 → Go Shopping
  - If Money ≤ 0 → Go Selling

### Space Stations
- Stationary trading hubs (60x60 units)
- Accept ore and produce various products
- Production rate: 1 product per 1 ore, with production checks every 0.5 seconds
- Products include: Gruffle, Druffle, Klintzpaw, Grogin, Fizz
- Each station specializes in producing one product type
- Randomly colored with unique designs
- Handle transactions with visiting entities

### Space Bars
- Social gathering spots
- Entities spend money here to socialize
- Visitors are tracked and displayed
- Stock Fizz drinks for sale
- Named with randomly generated space names

### Space Apartments
- Residential buildings where entities can rest
- Maximum capacity of 5 visitors at once
- Visual design with lit windows and doors
- Named with randomly generated space names

### Asteroids
- Source of ore for miners
- Randomly distributed across the world
- Varying sizes (15-30 units)
- Stationary resource nodes

### Stars
- Background decorative elements
- Grid-based distribution across the world
- Viewport culling for performance optimization
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
- **react-dnd v16.0.1** - Drag and drop functionality for rule reordering
- **react-dnd-html5-backend v16.0.1** - HTML5 backend for react-dnd
- **react-fps v1.0.6** - Performance monitoring
- **react-markdown v10.1.0** - Markdown rendering for documentation

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
2. **Navigate**: Use WASD or Arrow keys to move your player character around the world
3. **Explore**: Click on any entity name in the sidebar to zoom the camera to it
4. **Customize**: Expand an entity card to view and edit its rules editor
5. **Reorder Rules**: Drag and drop rules to change their priority order
6. **Monitor**: Use the tabs to filter entities by type (Traders, Miners, Stations, Space Bars, Space Apartments, Asteroids, Player, All)
7. **Read Docs**: Click the "Readme" tab to view this documentation in the app

## 🧩 Entity Rules System

Each entity follows a set of logic rules that determine its behavior. Rules are evaluated every second and executed when conditions are met.

### Rule Format
Each rule consists of:
- **ID**: Unique identifier for the rule
- **Good**: The resource to check (Ore, Money, or any Product)
- **Operator**: Comparison operator (=, <, >, <=, >=, !=)
- **Value**: Threshold value to compare against
- **Action**: What to do when condition is met
- **Destination Type** (optional): Target a specific entity type (e.g., SpaceStation, Asteroid)
- **Destination Name** (optional): Target a specific entity by name for precise routing

### Available Actions
- **Mine Ore**: Travel to an asteroid and mine ore
- **Trade Ore For Money**: Sell ore at a space station
- **Socialize**: Visit a space bar and spend money
- **Work At Bar**: Work at a space bar (bartenders only)
- **Go Shopping**: Buy products from a space station
- **Go Selling**: Sell products to a space station
- **Rest At Apartments**: Rest and restore energy at space apartments

### Destination Selection
Rules can optionally specify destinations for more precise control:
- **Destination Type**: Select a specific entity type (e.g., only target SpaceStations)
- **Destination Name**: Select a specific entity by name from a dropdown list
- **Random Selection**: If no destination is specified, entities choose randomly from valid targets
- **Smart Filtering**: Destination options are automatically filtered based on the action type
- **Disabled State**: Destination name selection is disabled when "Any (random)" is selected for destination type

### Rule Priority
Rules are evaluated in order from top to bottom. The first rule whose condition is met will be executed. You can drag and drop rules to reorder them and change their priority.

### Rule Behaviors
The game includes pre-built rule behaviors:
- **Miner Behavior**: Default mining and trading behavior
- **Trader Behavior**: Default buying and selling behavior
- **Bartender Behavior**: Default working and shopping behavior

You can apply these behaviors or create custom rules from scratch.

### Example Rules
A miner's default rules:
- If Money ≥ 50 → Socialize
- If Ore ≤ 0 → Mine Ore
- If Ore ≥ 10 → Trade Ore For Money

A trader's default rules:
- If Money > 0 → Go Shopping
- If Money ≤ 0 → Go Selling

## 📁 Project Structure

```
space-pants/
├── src/
│   ├── components/          # React UI components
│   │   ├── GoodsDisplay.tsx  # Goods visualization component
│   │   ├── MeepleCard.tsx    # Entity card display component
│   │   ├── RulesForm.tsx     # Rules editor with drag-and-drop
│   │   ├── RulesReadOnly.tsx # Read-only rules display
│   │   ├── StatBasic.tsx     # Basic stat display component
│   │   ├── Tabs.tsx          # Tab navigation component
│   │   ├── Toast.tsx         # Toast notification system
│   │   └── ValueDisplays.tsx # Value display utilities
│   ├── entities/             # Game entity classes
│   │   ├── Game.ts           # Excalibur game engine wrapper
│   │   ├── Meeple.ts         # Base entity class with AI logic
│   │   ├── Player.ts         # Player-controlled entity
│   │   ├── Miner.ts          # Miner entity
│   │   ├── Trader.ts         # Trader entity
│   │   ├── SpaceStation.ts   # Space station entity
│   │   ├── SpaceBar.ts       # Space bar entity
│   │   ├── SpaceApartments.ts # Space apartment entity
│   │   ├── Asteroid.ts       # Asteroid resource node
│   │   ├── Star.ts           # Background star entities
│   │   ├── ruleTemplates.ts  # Default rule behaviors
│   │   ├── types.ts          # Entity type definitions
│   │   └── utils/            # Entity utilities
│   │       ├── createSpaceShipOutOfShapes.ts
│   │       └── generateSpaceName.ts
│   ├── hooks/                # React hooks
│   │   └── useGame.tsx       # Game initialization and setup
│   ├── utils/                # Utility functions
│   │   ├── createStarTilemap.ts # Star generation utility
│   │   ├── goodsMetadata.tsx # Goods metadata and icons
│   │   ├── goodsUtils.ts     # Goods manipulation utilities
│   │   ├── keyboardControls.ts # Keyboard control utilities
│   │   └── ruleUtils.ts      # Rule evaluation utilities
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   ├── consts.ts             # Application constants (re-exports from game-config)
│   ├── App.css               # Application styles
│   └── index.css             # Global styles
├── public/                   # Static assets
│   └── vite.svg
├── dist/                     # Production build output
├── docs.md                   # Additional documentation
├── presentation.md           # Presentation notes
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
Edit `src/entities/game-config.ts` to modify:
- World size (`WORLD_WIDTH`, `WORLD_HEIGHT`) - Default: 2500x2500
- Number of entities (in `ENTITY_COUNTS`):
  - `TRADERS` - Default: 5
  - `MINERS` - Default: 5
  - `SPACE_STATIONS` - Default: 5 (one per product type)
  - `ASTEROIDS` - Default: 5
  - `SPACE_BARS` - Default: 2
  - `SPACE_APARTMENTS` - Default: 2
  - `BARTENDERS_PER_BAR` - Default: 1
- Player speed - Default: 100 (configurable via `DEFAULT_SHIP_SPEED` in `src/entities/game-config.ts`)
- Camera zoom level - Default: 2x
- Star distribution and spacing (in `src/utils/createStarTilemap.ts`)

### Entity Behavior
- Modify entity classes in `src/entities/` to change default rules and starting conditions
- Edit rule behaviors in `src/entities/ruleTemplates.ts` (includes Miner, Trader, and Bartender behaviors)
- Customize entity appearance in entity constructors

### Styling
- Modify `src/index.css` for global styles
- Use TailwindCSS classes throughout components
- Customize DaisyUI theme in TailwindCSS configuration

## ⚡ Performance

The game uses React's automatic memoization to maintain smooth performance:
- State updates occur every 1000ms (1 second)
- 20+ entities update simultaneously
- React compares component output automatically
- Only components with changed output re-render
- This enables smooth 60 FPS gameplay even with frequent updates

### Performance Optimizations
- Viewport culling for stars (only render visible stars)
- Efficient entity state management
- React's built-in output comparison prevents unnecessary re-renders
- FPS monitoring helps identify performance issues

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
- Monitor FPS counter for performance issues
- Use entity cards to inspect entity state

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
- New entity types
- UI/UX improvements
- Performance optimizations
- Documentation improvements
- New game mechanics
- Additional rule actions
- New products or resources
- Enhanced visualization features

## 📝 License

This is a private project. All rights reserved.

## 🙏 Acknowledgments

- Built with [Excalibur.js](https://excaliburjs.com/) game engine
- UI components styled with [DaisyUI](https://daisyui.com/)
- Icons provided by [Tabler Icons](https://tabler.io/icons)

---

Enjoy exploring the space economy! 🚀
