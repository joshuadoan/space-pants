# Space Pants

A space economy simulation game built with React, TypeScript, and Excalibur.js. Watch autonomous entities mine, trade, socialize, and interact in a dynamic space economy.

## 🚀 Features

- **Real-time Space Economy Simulation**: Watch miners, traders, space stations, and other entities interact autonomously
- **Entity Management**: View and manage all entities in the game world through an intuitive tabbed interface
- **Customizable Behavior**: Edit logic rules for entities to control their actions based on resource conditions
- **Drag-and-Drop Rule Reordering**: Reorder entity rules by dragging them in the rules editor
- **Dynamic Production**: Space stations convert ore into various products (Gruffle, Druffle, Klintzpaw, Grogin, Fizz)
- **Trading System**: Entities buy and sell goods at space stations
- **Social System**: Entities visit space bars and space apartments to socialize and spend money
- **Interactive Camera**: Click on any entity to zoom and follow it
- **FPS Monitoring**: Real-time performance metrics displayed on screen
- **Built-in Documentation**: View the README directly in the app via the Readme tab

## 🎮 Game Entities

### Player
- Controllable character that can move around the space world
- Starts with 0 money
- Can be controlled with keyboard (WASD/Arrow keys)

### Miners
- Mine ore from asteroids
- Trade ore for money at space stations
- Visit space bars when they have enough money (≥50)
- Default behavior: Mine → Trade → Socialize cycle

### Traders
- Buy products from space stations when they have money
- Sell products to space stations when they run out of money
- Start with 10 money

### Space Stations
- Stationary trading hubs
- Accept ore and produce various products
- Production rate: 1 product per 10 ore per second
- Products include: Gruffle, Druffle, Klintzpaw, Grogin, Fizz

### Space Bars
- Social gathering spots
- Entities spend money here to socialize
- Visitors are tracked and displayed
- Stock Fizz drinks for sale

### Space Apartments
- Residential buildings where entities can rest
- Maximum capacity of 5 visitors at once
- Visual design with lit windows and doors

### Asteroids
- Source of ore for miners
- Randomly distributed across the world
- Varying sizes (15-30 units)

### Stars
- Background decorative elements
- Grid-based distribution across the world
- Viewport culling for performance optimization

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Excalibur.js** - 2D game engine
- **TailwindCSS + DaisyUI** - Styling
- **Vite** - Build tool and dev server
- **react-fps** - Performance monitoring
- **react-markdown** - Markdown rendering for documentation
- **react-dnd** - Drag and drop functionality for rule reordering
- **@tabler/icons-react** - Icon library

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/space-pants.git
cd space-pants
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser to `http://localhost:5173` (or the port shown in terminal)

## 🏗️ Build

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## 🎯 How to Play

1. **Observe**: Watch the autonomous entities go about their business
2. **Navigate**: Use WASD or Arrow keys to move your player character
3. **Explore**: Click on any entity name in the sidebar to zoom the camera to it
4. **Customize**: Expand an entity card to view and edit its rules editor
5. **Reorder Rules**: Drag and drop rules to change their priority order
6. **Monitor**: Use the tabs to filter entities by type (Traders, Miners, Stations, Space Bars, Space Apartments, etc.)
7. **Read Docs**: Click the "Readme" tab to view this documentation in the app

## 🧩 Entity Rules System

Each entity follows a set of logic rules that determine its behavior. Rules are evaluated every second and executed when conditions are met.

### Rule Format
- **Good**: The resource to check (Ore, Money, etc.)
- **Operator**: Comparison operator (=, <, >, <=, >=)
- **Value**: Threshold value to compare against
- **Action**: What to do when condition is met

### Available Actions
- **Mine Ore**: Travel to an asteroid and mine ore
- **Trade Ore For Money**: Sell ore at a space station
- **Socialize**: Visit a space bar and spend money
- **Go Shopping**: Buy products from a space station
- **Go Selling**: Sell products to a space station

### Rule Priority
Rules are evaluated in order from top to bottom. You can drag and drop rules to reorder them and change their priority.

### Example Rules
A miner's default rules:
- If Money ≥ 50 → Socialize
- If Ore ≤ 0 → Mine Ore
- If Ore ≥ 10 → Trade Ore For Money

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── GoodsDisplay.tsx
│   ├── MeepleCard.tsx   # Entity card display component
│   ├── RulesForm.tsx    # Rules editor component with drag-and-drop
│   ├── RulesReadOnly.tsx # Read-only rules display
│   ├── StatBasic.tsx
│   ├── Tabs.tsx
│   ├── Toast.tsx        # Toast notification system
│   └── ValueDisplays.tsx
├── entities/            # Game entity classes
│   ├── Game.ts          # Excalibur game engine wrapper
│   ├── Meeple.ts        # Base entity class
│   ├── Player.ts
│   ├── Miner.ts
│   ├── Trader.ts
│   ├── SpaceStation.ts
│   ├── SpaceBar.ts
│   ├── SpaceApartments.ts
│   ├── Asteroid.ts
│   ├── Star.ts          # Background star entities
│   ├── ruleTemplates.ts # Default rule templates
│   └── types.ts         # Entity type definitions
├── hooks/               # React hooks
│   ├── useGame.ts       # Game initialization
│   ├── useGameEntities.ts # Entity state management
│   └── useKeyboardControls.ts
├── utils/               # Utility functions
│   ├── addStars.ts      # Star generation utility
│   ├── goodsMetadata.tsx
│   └── keyboardControls.ts
└── types.ts             # TypeScript type definitions
```

## 🎨 Customization

### World Configuration
Edit `src/hooks/useGame.ts` to modify:
- World size (`WORLD_WIDTH`, `WORLD_HEIGHT`)
- Number of entities (traders, miners, stations, asteroids, space bars, space apartments)
- Player speed
- Camera zoom level
- Star distribution and spacing

### Entity Behavior
Modify entity classes in `src/entities/` to change default rules and starting conditions.

## 🐛 Development

Run linter:
```bash
pnpm lint
```

## 🤝 Contributing

Contributions are welcome! This is an open source project and we appreciate any help you can provide.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Areas for Contribution

- Bug fixes
- New entity types
- UI/UX improvements
- Performance optimizations
- Documentation improvements
- New game mechanics

## 📝 License

This project is open source. Please check the LICENSE file for details on how you can use, modify, and distribute this code.

---

Enjoy exploring the space economy! 🚀

