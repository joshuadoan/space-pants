import { GraphicsGroup } from "excalibur";
import { EntityGraphicStyle } from "./types";
import { createSpaceShipOutOfShapes } from "./default";
import { createMinerShipOutOfShapes, createMiner2ShipOutOfShapes } from "./miner";
import { createTraderShipOutOfShapes, createTrader2ShipOutOfShapes } from "./trader";
import { createBartenderShipOutOfShapes, createBartender2ShipOutOfShapes } from "./bartender";
import { createSpaceStationGraphic, createSpaceBarGraphic, createSpaceApartmentsGraphic } from "./buildings";
import { createPirateShipOutOfShapes, createPoliceShipOutOfShapes, createCruiseShipOutOfShapes, createGalacticZooOutOfShapes } from "./special";
import { createAsteroidGraphic } from "./asteroid";

// Re-export the enum for convenience
export { EntityGraphicStyle } from "./types";

// Re-export individual creation functions for convenience
export { createSpaceShipOutOfShapes } from "./default";

/**
 * Unified function to create entity graphics based on graphic style name.
 * Returns the appropriate graphic style for the given style name.
 * 
 * @param style - The EntityGraphicStyle to create graphics for
 * @returns A GraphicsGroup with the appropriate entity design
 */
export function createEntityGraphic(style: EntityGraphicStyle): GraphicsGroup {
  switch (style) {
    case EntityGraphicStyle.Miner:
      return createMinerShipOutOfShapes();
    case EntityGraphicStyle.Trader:
      return createTraderShipOutOfShapes();
    case EntityGraphicStyle.Bartender:
      return createBartenderShipOutOfShapes();
    case EntityGraphicStyle.SpaceStation:
      return createSpaceStationGraphic();
    case EntityGraphicStyle.SpaceBar:
      return createSpaceBarGraphic();
    case EntityGraphicStyle.SpaceApartments:
      return createSpaceApartmentsGraphic();
    case EntityGraphicStyle.Pirate:
      return createPirateShipOutOfShapes();
    case EntityGraphicStyle.Police:
      return createPoliceShipOutOfShapes();
    case EntityGraphicStyle.CruiseShip:
      return createCruiseShipOutOfShapes();
    case EntityGraphicStyle.GalacticZoo:
      return createGalacticZooOutOfShapes();
    case EntityGraphicStyle.Miner2:
      return createMiner2ShipOutOfShapes();
    case EntityGraphicStyle.Trader2:
      return createTrader2ShipOutOfShapes();
    case EntityGraphicStyle.Bartender2:
      return createBartender2ShipOutOfShapes();
    case EntityGraphicStyle.Asteroid:
      return createAsteroidGraphic();
    case EntityGraphicStyle.Default:
    default:
      return createSpaceShipOutOfShapes();
  }
}

