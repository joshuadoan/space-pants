# space-pants

**🎮 [Live Demo](https://spacefriends.org/stats)**

A space simulation game built with React, TypeScript, and Excalibur.

## Overview

Space Pants is an autonomous space economy simulation where different entities (Meeples) interact with each other based on condition-based behaviors. The simulation runs continuously, with entities performing actions like mining, trading, and consuming resources.

## Simulation

The simulation features several types of entities, each with unique behaviors:

### Entity Types

- **Miners**: Mine minerals from asteroids, sell them to Space Stores for money, buy fizzy drinks from Space Bars, and consume them
- **Bartenders**: Buy fizzy drinks from Space Stores and restock Space Bars
- **Asteroids**: Generate mineral reserves over time
- **Space Stores**: Convert minerals into fizzy drinks and money through transmutation
- **Space Bars**: Sell fizzy drinks to miners
- **Space Apartments**: Serve as homes for miners
- **Pirate Bases**: Stationary space stations that serve as homes for pirate ships
- **Pirate Ships**: Hostile entities that patrol the space, detect miners using radar, chase them, and fire laser projectiles that steal money from their targets

### How It Works

Each entity has a set of **conditions** that trigger actions based on their inventory state. For example:
- If a miner has no money, they mine ore from asteroids
- If a miner has ore, they sell it to Space Stores
- If a miner has money, they buy fizzy drinks
- If a miner has too many fizzy drinks, they consume them

The simulation updates every 500ms, and entities move autonomously to perform their actions.

### Combat System

Pirates introduce a combat element to the simulation:

- **Patrolling**: Pirate ships patrol the space, moving randomly while searching for targets
- **Radar Detection**: Pirates use a radar system to detect miners within a 600 unit radius
- **Chasing**: When a pirate detects a miner, it switches to chase mode and pursues the target
- **Laser Attacks**: While chasing, pirates fire red laser projectiles at their targets
  - Lasers track moving targets automatically
  - On hit, lasers transfer 1 money from the target to the pirate
  - Chases last up to 5 seconds before the pirate gives up

### Resources

Entities manage three types of resources:
- **Minerals**: Mined from asteroids
- **Money**: Earned from selling minerals
- **Fizzy**: Drinks that can be bought and consumed

## Controls

### Camera Controls

The camera can be controlled in two modes:

1. **Player Mode** (default when no meeple is selected):
   - Use **Arrow Keys** (↑ ↓ ← →) to manually move the camera around the game world
   - Camera movement is constrained to the game world boundaries

2. **Meeple Mode** (when a meeple is selected):
   - Camera automatically locks to and follows the selected meeple
   - Activated when you click on a meeple to view its details

The current camera mode is indicated by an icon in the top-right of the sidebar.

### Zoom Control

- Use the zoom slider in the UI to adjust the camera zoom level
- Zoom level affects how much of the game world is visible at once

### Navigation

- **Filter by Role**: Use the dropdown in the main view to filter meeples by their role (Miner, Bartender, Asteroid, etc.)
- **Select Meeple**: Click on any meeple in the list to view detailed information and lock the camera to follow them
- **View Stats**: The header displays total counts of each entity type and resource in the simulation

## Development

Built with:
- React + TypeScript
- Excalibur (game engine)
- Vite
- React Router
