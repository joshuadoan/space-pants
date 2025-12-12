import { useEffect, useReducer, useRef } from "react";
import { Game } from "../entities/Game";
import { Player } from "../entities/Player";
import { Vector } from "excalibur";
import { addStars } from "../utils/addStars";
import { SpaceStation } from "../entities/SpaceStation";
import { Trader } from "../entities/Trader";
import { Asteroid } from "../entities/Asteroid";
import { Miner } from "../entities/Miner";
import { SpaceBar } from "../entities/SpaceBar";
import { generateSpaceName } from "../entities/utils/generateSpaceName";
import { SpaceApartments } from "../entities/SpaceApartments";
import { TreasureCollector } from "../entities/TreasureCollector";
import { DEFAULT_SHIP_SPEED } from "../consts";
import type { Actor } from "excalibur";
import { Meeple } from "../entities/Meeple";

const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 1000;
const NUMBER_OF_TRADERS = 10;
const NUMBER_OF_SPACE_STATIONS = 5;
const NUMBER_OF_ASTEROIDS = 5;
const NUMBER_OF_MINERS = 10;
const NUMBER_OF_SPACE_BARS = 3;
const NUMBER_OF_SPACE_APARTMENTS = 3;

type SetGameAction = {
  type: "set-game";
  payload: Game;
};

type SetMeeplesAction = {
  type: "set-meeples";
  payload: Meeple[];
};

type GameAction = SetGameAction | SetMeeplesAction;

type GameState = {
  game: Game | null;
  isLoading: boolean;
  meeples: Meeple[];
};

const initialState: GameState = {
  game: null,
  isLoading: true,
  meeples: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "set-game": {
      return {
        ...state,
        game: action.payload,
        isLoading: false,
      };
    }
    case "set-meeples": {
      return {
        ...state,
        meeples: action.payload,
      };
    }
    default:
      return state;
  }
}
export const useGame = () => {
  //   const [game, setGame] = useState<Game | null>(null);
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const game = new Game(WORLD_WIDTH, WORLD_HEIGHT);

    const cameraZoom = 2; // Zoom in 5x - shows 1/5th of the world
    game.currentScene.camera.zoom = cameraZoom;
    //Create player
    const playerSpeed = DEFAULT_SHIP_SPEED;
    const player = new Player(
      new Vector(WORLD_WIDTH / 2, WORLD_HEIGHT / 2),
      playerSpeed,
      "Player"
    );

    game.currentScene.add(player);

    // Make camera follow the player
    game.currentScene.camera.strategy.lockToActor(player);
    addStars(game);

    // seed 10 randsom space stations
    for (let i = 0; i < NUMBER_OF_SPACE_STATIONS; i++) {
      const spaceStation = new SpaceStation(
        new Vector(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT),
        generateSpaceName()
      );
      game.currentScene.add(spaceStation);
    }

    // seed 20 asteroids at random spots
    for (let i = 0; i < NUMBER_OF_ASTEROIDS; i++) {
      const asteroid = new Asteroid(
        new Vector(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT),
        15 + Math.random() * 15 // Random size between 15 and 30
      );
      game.currentScene.add(asteroid);
    }

    // create miners
    for (let i = 0; i < NUMBER_OF_MINERS; i++) {
      const miner = new Miner(
        new Vector(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT),
        1,
        generateSpaceName()
      );
      miner.name = generateSpaceName();

      game.currentScene.add(miner);
    }

    // create 20 space meeples and seed random positions
    for (let i = 0; i < NUMBER_OF_TRADERS; i++) {
      const meeple = new Trader(
        new Vector(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT),
        1,
        generateSpaceName()
      );
      meeple.name = generateSpaceName();

      game.currentScene.add(meeple);
    }

    // create 10 space bars at random positions
    for (let i = 0; i < NUMBER_OF_SPACE_BARS; i++) {
      const spaceBar = new SpaceBar(
        new Vector(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT),
        generateSpaceName()
      );
      spaceBar.name = generateSpaceName();

      game.currentScene.add(spaceBar);
    }

    // create 10 space apartments at random positions
    for (let i = 0; i < NUMBER_OF_SPACE_APARTMENTS; i++) {
      const spaceApartment = new SpaceApartments(
        new Vector(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT),
        generateSpaceName()
      );
      spaceApartment.name = generateSpaceName();

      game.currentScene.add(spaceApartment);
    }

    // create 1 treasure collector at random position
    const treasureCollector = new TreasureCollector(
      new Vector(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT),
      1,
      generateSpaceName()
    );
    treasureCollector.name = generateSpaceName();

    game.currentScene.add(treasureCollector);

    game.start().then(() => {
      dispatch({ type: "set-game", payload: game });
    });
  }, []);

  // Update gameRef when game changes
  useEffect(() => {
    gameRef.current = gameState.game;
  }, [gameState.game]);

  // Start entities interval only after game has started
  useEffect(() => {
    if (!gameState.game || gameState.isLoading) {
      return;
    }

    const interval = setInterval(() => {
      if (gameRef.current) {
        const actors = gameRef.current.currentScene.actors;
        const meeples = actors.filter(
          (actor: Actor) => actor instanceof Meeple
        );
        dispatch({ type: "set-meeples", payload: meeples });
      }
    }, 300);

    return () => clearInterval(interval);
  }, [gameState.game, gameState.isLoading]);

  return {
    ...gameState,
    meeples: gameState.meeples,
  };
};
