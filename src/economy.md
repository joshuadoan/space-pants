# Space Pants Economy Analysis

## Overview

Space Pants features a dynamic, real-time space economy simulation where autonomous entities interact through resource extraction, production, trading, and consumption. The economy is driven by rule-based behaviors that entities follow, creating emergent economic patterns.

## Core Resources & Goods

### Resources
- **Ore**: Raw material extracted from asteroids, used for production
- **Money**: Universal currency for all transactions

### Products
Five distinct product types that space stations produce:
- **Gruffle** (Blue)
- **Druffle** (Green)
- **Klintzpaw** (Purple)
- **Grogin** (Yellow)
- **Fizz** (Red) - Special product sold at space bars

### Entity Stats
- **Health**: Entity health status (default: 100)
- **Energy**: Required for work activities, depletes over time (default: 100)

## Entity Types & Economic Roles

### Miners
**Count**: 10  
**Role**: Primary resource extractors

**Economic Activities**:
- Mine ore from asteroids (1 ore per mining action, 3s delay)
- Sell ore to space stations (1 ore → 2 money, 5s delay)
- Socialize at space bars when money ≥ 50 (spends all money, restores energy, 5s delay)
- Rest at apartments when energy ≤ 0 (restores energy to 100, 3s delay)

**Behavior Rules** (priority order):
1. If energy ≤ 0 → Rest at apartments
2. If money ≥ 50 → Socialize at bar
3. If ore ≥ 10 → Sell ore to station
4. If ore < 10 → Mine ore from asteroid

**Starting Resources**: 0 ore, 0 money

### Traders
**Count**: 10  
**Role**: Product distribution network

**Economic Activities**:
- Buy products from stations that produce them (2 money → 1 product, 3s delay)
- Sell products to stations that don't produce them (1 product → 2 money, 3s delay)
- Each trader specializes in one product type

**Starting Resources**: 42 money

**Note**: Currently traders have no default behavior rules defined, requiring custom rule configuration.

### Space Stations
**Count**: 5  
**Role**: Production hubs and trading centers

**Economic Activities**:
- **Production**: Convert ore to products (1 ore → 1 product of station's type, 3s conversion delay)
  - Production checks every 0.5 seconds
  - Produces `floor(ore / 1)` products per cycle
- **Trading**: 
  - Buy ore from miners (1 ore → 2 money)
  - Buy products from traders (1 product → 2 money)
  - Sell products to traders (1 product → 2 money)

**Regeneration**:
- Ore regenerates when below 50 ore threshold
- Regenerates 2 ore per second (1000ms cycle)

**Starting Resources**: 42 money, 0 ore

**Specialization**: Each station produces one specific product type (Gruffle, Druffle, Klintzpaw, Grogin, or Fizz)

### Asteroids
**Count**: 5  
**Role**: Primary ore source

**Economic Activities**:
- Provide ore for mining (1 ore per mining action)
- Regenerate ore when depleted

**Regeneration**:
- Ore regenerates when below 100 ore threshold
- Regenerates 1 ore per second (1000ms cycle)

**Starting Resources**: 1 ore

### Space Bars
**Count**: 3  
**Role**: Social hubs and service economy

**Economic Activities**:
- Sell Fizz to visitors (1 money → 1 fizz)
- Collect money from socializing entities
- Pay bartenders for work (3 money per work session)

**Regeneration**:
- Fizz regenerates when below 5 fizz threshold
- Regenerates 1 fizz per 2 seconds (2000ms cycle)

**Starting Resources**: 1 fizz, 0 money

### Bartenders
**Count**: 3 per bar (9 total)  
**Role**: Service workers

**Economic Activities**:
- Work at space bars (earn 3 money, deplete energy to 0, 30s work shift)
- Buy products from stations when money ≥ 50 (2 money → 1 product, 3s delay)
- Rest at apartments when energy ≤ 0 (restores energy to 100, 3s delay)

**Behavior Rules** (priority order):
1. If energy ≤ 0 → Rest at apartments
2. If money ≥ 50 → Buy product from station
3. If energy > 0 → Work at bar

**Starting Resources**: 0 ore, 0 money

### Space Apartments
**Count**: 3  
**Role**: Rest and recovery facilities

**Economic Activities**:
- Provide free energy restoration (restores to 100 energy, 3s delay)
- Maximum capacity: 5 visitors

**No Economic Cost**: Resting is free (no money or resource cost)

## Economic Flows

### Primary Production Chain

```
Asteroids → Miners → Space Stations → Traders → Space Stations
   (Ore)    (Mine)    (Produce)      (Distribute)  (Consume)
```

1. **Extraction**: Miners extract ore from asteroids
2. **Trading**: Miners sell ore to stations (1 ore = 2 money)
3. **Production**: Stations convert ore to products (1 ore = 1 product)
4. **Distribution**: Traders buy products from producing stations and sell to non-producing stations
5. **Consumption**: Stations accumulate products they don't produce

### Secondary Economy

```
Bartenders → Space Bars → Socializing Entities
  (Work)      (Earn)        (Spend Money)
```

1. **Service Work**: Bartenders work at bars, earning money
2. **Social Spending**: Entities with money ≥ 50 spend all money at bars to restore energy
3. **Energy Management**: Entities rest at apartments when energy depleted

## Pricing & Exchange Rates

| Transaction | Rate | Notes |
|------------|------|-------|
| Ore → Money | 1 ore = 2 money | Miners sell to stations |
| Money → Product | 2 money = 1 product | Traders buy from stations |
| Product → Money | 1 product = 2 money | Traders sell to stations |
| Fizz | 1 money = 1 fizz | Socializing at bars |
| Work Earnings | 3 money per shift | Bartenders earn from bars |

## Regeneration Systems

### Asteroids
- **Threshold**: 100 ore
- **Rate**: 1 ore per second
- **Purpose**: Maintain ore supply for miners

### Space Stations
- **Threshold**: 50 ore
- **Rate**: 2 ore per second
- **Purpose**: Maintain production capacity

### Space Bars
- **Threshold**: 5 fizz
- **Rate**: 1 fizz per 2 seconds
- **Purpose**: Maintain social service availability

## Action Timings

| Action | Duration | Entity |
|--------|----------|--------|
| Mining | 3s | Miners |
| Trading Ore | 5s | Miners ↔ Stations |
| Socializing | 5s | All entities |
| Working | 30s | Bartenders |
| Resting | 3s | All entities |
| Shopping | 3s | Traders, Bartenders |
| Selling | 3s | Traders |
| Production | 3s | Stations |

## Economic Balance Considerations

### Money Flow
- **Money Sources**:
  - Miners: Selling ore (1 ore → 2 money)
  - Bartenders: Working at bars (3 money per shift)
  - Traders: Selling products (1 product → 2 money)

- **Money Sinks**:
  - Buying products (2 money → 1 product)
  - Socializing at bars (spends all money ≥ 50)

### Ore Flow
- **Ore Sources**:
  - Asteroid regeneration (1 ore/sec when < 100)
  - Station regeneration (2 ore/sec when < 50)

- **Ore Sinks**:
  - Production at stations (1 ore → 1 product)
  - Mining extraction (1 ore per mining action)

### Product Flow
- **Product Sources**:
  - Station production (1 ore → 1 product)
  - Bar regeneration (Fizz only)

- **Product Sinks**:
  - Trading between stations
  - Consumption at bars (Fizz)

## Behavioral Economics

### Energy Management
Entities must balance work/activity with rest:
- **Energy Depletion**: Working depletes energy
- **Energy Restoration**: 
  - Free at apartments (3s delay)
  - Expensive at bars (spends all money ≥ 50, 5s delay)

### Decision Priorities
Entities evaluate rules in priority order:
1. **Survival**: Energy management (rest when depleted)
2. **Luxury**: Social spending (when money available)
3. **Work**: Resource gathering and trading
4. **Idle**: Default state when no conditions met

## Economic Emergence

The economy creates emergent patterns through:
1. **Resource Scarcity**: Limited ore and products drive trading
2. **Specialization**: Stations produce one product type, creating trade opportunities
3. **Price Discovery**: Fixed exchange rates create predictable profit margins
4. **Service Economy**: Bars create money circulation through social spending
5. **Energy Constraints**: Force entities to balance work and rest cycles

## Configuration Parameters

Key economic parameters (from `game-config.ts`):
- `TRADE_MONEY_AMOUNT`: 2 (ore value multiplier)
- `PRODUCT_SELL_PRICE`: 2 (product value)
- `WORK_EARNINGS`: 3 (bartender wages)
- `FIZZ_PRICE`: 1 (socializing cost)
- `ORE_PER_PRODUCT`: 1 (production efficiency)
- `MINING_ORE_AMOUNT`: 1 (extraction rate)
- `TRADE_ORE_AMOUNT`: 1 (trading batch size)

## Potential Economic Issues

1. **Traders**: No default behavior rules, requiring manual configuration
2. **Money Accumulation**: No money sinks beyond socializing, potential for inflation
3. **Product Accumulation**: Stations may accumulate products they don't produce without consumption
4. **Energy Balance**: Long work shifts (30s) vs quick rest (3s) may create energy surplus

## Future Economic Considerations

- Dynamic pricing based on supply/demand
- Product consumption/decay mechanisms
- More diverse money sinks
- Inter-station product demand systems
- Economic metrics and analytics

