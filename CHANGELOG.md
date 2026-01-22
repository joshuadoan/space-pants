# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2026-01-14
- **Multi-track Audio Player**: Added audio player component with support for multiple tracks
  - Play/pause controls with visual feedback
  - Next and previous track navigation
  - Waveform visualization using Wavesurfer
  - Three tracks available: "Blue Is For Baby, Red Is For Radical", "How You Like Me Now", and "She Said Hey"
- **Banks and Bankers**: New financial entities in the economy
  - **Banks**: Stationary entities that generate money when their reserves are low
  - **Bankers**: Mobile entities that transfer money from banks to Space Stores with negative balances
  - Bankers patrol between banks and Space Stores, ensuring stores maintain positive money reserves
- **Touch Controls**: Added touch and swipe gesture support for camera movement on mobile devices
  - Enables camera panning using touch gestures alongside keyboard controls
  - Improves mobile responsiveness and user experience

### Changed - 2026-01-14
- Increased game world dimensions from 1000x1000 to 2500x2500 units for expanded playable area
- Adjusted game update interval from 500ms to 1000ms for better performance
- Refactored Audio component UI with modern icon buttons and improved styling
- Moved Audio component from App to Layout for better placement
- Reduced default BARTENDER and PIRATE_SHIP counts in game constants
- Updated default meeple filter from PirateShip to Miner
- Improved UI layout with tabs and inventory counts displayed side by side on medium screens

### Added - 2026-01-13
- **Pirates and Pirate Bases**: Added new hostile entities to the game
  - **Pirate Bases**: Stationary space stations that serve as homes for pirate ships
  - **Pirate Ships**: Mobile entities that patrol space looking for miners
    - Use radar system to detect miners within 600 unit radius
    - Automatically switch from patrolling to chasing when targets are detected
    - Fire laser projectiles at chased targets that steal money (1 money per hit)
    - Chases automatically end after 5 seconds if target isn't caught
    - Variable speeds between 50-150 units
- **Laser Projectile System**: New combat mechanic
  - Pirates fire red laser projectiles that track moving targets
  - Lasers automatically transfer money from target to shooter on hit
  - Projectiles have 3 second lifetime and self-destruct on collision or timeout
  - Refactored into separate `LaserProjectile` class for better code organization
- **Radar System**: New detection mechanic for pirates
  - Pirates can scan for specific entity types within a configurable radius
  - Enables dynamic target detection and pursuit behavior
- **Meeple Facing Logic**: Entities now face left or right based on movement direction
- **Zoom Control**: Added UI slider to adjust camera zoom level
- Enhanced keyboard controls for camera movement

### Changed - 2026-01-13
- Refactor layout and Counts component for cleaner UI
- Update counts and adjust Counts component spacing
- Improved camera control indicator display

### Changed - 2026-01-11
- Adjust game economy and condition thresholds
- Enforce type-safe icon keys in IconMap
- Display game constants in Stats component
- Add Netlify redirects file for SPA routing (#26)
- Add ProductsChart and enhance Stats with product history (#25)
- Instructions and more (#24)

### Fixed - 2026-01-10
- Fix money bug (#23)
- Hide sidebar and counts on small screens (#22)
- Loading state (#21)

### Changed - 2026-01-09
- Simplify everything (#20)
- Refine UI layout and default filter, improve inventory logic (#19)
- Update layout header and Counts component styling (#18)
- Refactor role filter and add icon titles for accessibility (#17)

### Added - 2026-01-08
- Add mining, buying, selling, transmutation, and generation actions (#16)
- Bartender update (#15)

### Changed - 2026-01-07
- Refactor (#14)

### Changed - 2026-01-01
- Reduce max default ship speed to 150 (#13)
- Update entity counts in consts.ts
- Refactor UI and update game constants
- Add 'resting' state and action for Meeples

### Changed - 2025-12-31
- Update docs and journal formatting for entity details
- Refactor meeple actions and enhance miner rules
- Refactor meeple detail components and tabs logic
- Refactor rules and UI for Meeple details and visualizers
- Refactor rules system to use flat rule arrays
- Add vitals transaction actions and update state timeline
- Add Help tab and virtualized meeple list
- Add action timeline to Meeple details and update rule names
- Add source tracking to journal entries and rule actions
- Enhance journal entries with contextual icons
- Add typewriter effect and journal formatting utilities
- Update docs for new rules system and UI features
- Add DEFAULT_DELAY to async rule actions
- Add journal feature for meeples and UI integration

### Added - 2025-12-30
- Add RulesVisualizer and improve rules handling
- Refactor meeple rules logic and update game setup
- Refactor meeple rules and add generator logic

### Changed - 2025-12-29
- Update MeeplesList.tsx
- Add rules for Asteroid and Space Store roles
- Remove legacy src_old directory and update docs
- Refactor Meeple logic to rule-based system

### Changed - 2025-12-28
- Add instruction editing and refactor goods cost logic

### Changed - 2025-12-27
- Refactor transaction logic and add aggregated stats

### Changed - 2025-12-26
- Refactor meeple actions and add new entity types

### Changed - 2025-12-23
- Refactor meeple details and add zoom slider
- Add style prop to MeepleDetails for list virtualization
- Virtualize MeeplesList and adjust game entity counts
- Increase MINER count in useGame hook
- Refactor meeple filter to single selection tab UI

### Added - 2025-12-22
- Add toggle to show/hide UI in MeeplesList
- Increase game area and refactor meeple delay
- Enhance Meeple state display and increase miner count
- Update dependencies and remove custom Cursor rules
- Improve MeeplesList UI and add space name generator
- Remove Instructions component and inline logic in MeeplesList
- Refactor instructions to data objects and add condition evaluation
- Refactor meeple list and instructions, add react-window

### Added - 2025-12-20
- Add instruction system for Meeple actions

### Changed - 2025-12-16
- Refactor rule system for dynamic targets and fix miner flow
- Add SpaceStore role, meeple list UI, and ore selling logic
- Add rule evaluation and action execution to Meeple
- Add traveling state to Meeple and update dispatch logic
- Refactor meeple types and add graphics utilities

### Changed - 2025-12-15
- Remove unused constants and icon imports
- Refactor icon usage and remove unused entity files
- Remove debug logs and update navigation behavior
- Prevent multiple mechanics from fixing same broken meeple
- Update main content div to use fixed width class
- Routes

### Added - 2025-12-14
- Add aggregate game stats to EconomyDisplay and refine pirate chase
- Improve styling of RulesReadOnly component
- Add centralized economy config and economy display UI
- Add Mechanic meeple type to MeepleCard component
- Enhance diary UX and fix Meeple broken state handling
- Add SpaceCafe, SpaceDance, SpaceFun entities and diary system
- Add Mechanic meeple type and fixing behavior
- Improve pirate AI, laser collision, and visuals
- Expand pirate behavior to chase more targets
- Add pirates, dens, and player goods aggregation
- Add required default rules and improve rules management
