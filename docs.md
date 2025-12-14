# Space Pants - Talk Notes

## Project Overview
- Real-time space economy simulation
- React 19 + TypeScript + Excalibur.js
- Autonomous entities interact in dynamic economy

## Features

### Entities
- Miners: Mine → Trade → Socialize cycle
- Traders: Buy/sell products at stations
- Space Stations: Convert ore to products
- Space Bars: Social gathering spots
- Space Apartments: Rest and recovery facilities
- Bartenders: Work at bars, buy products
- Pirates: Patrol, chase traders, steal money
- Pirate Dens: Rest facilities for pirates
- Asteroids: Ore sources
- Player: Controllable character

### Interactive
- Tabbed interface to filter entities
- Edit entity rules in real-time
- Click entity to zoom camera
- Real-time stats & FPS monitoring

## Performance: React Auto-Memoization

### The Problem
- State updates every 1000ms (1 second)
- 70+ entities updating simultaneously
- Complex UI cards per entity

### The Solution
- React compares component output automatically
- Only re-renders if output changed
- Skips unchanged components → smooth 60 FPS

### How It Works
- Functional components = pure functions
- React compares virtual DOM output
- Same output = skip re-render
- Happens automatically, no manual memo needed

### Key Point
Even with 1 second updates, React's output comparison keeps it smooth because unchanged components don't re-render.

## Tech Stack
- React 19, TypeScript, Excalibur.js
- TailwindCSS, Vite
- Custom hooks + reducer pattern
