import { useEffect, useReducer } from "react";
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
import { DEFAULT_SHIP_SPEED } from "../consts";

const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 1000;
const NUMBER_OF_TRADERS = 10;
const NUMBER_OF_SPACE_STATIONS = 5;
const NUMBER_OF_ASTEROIDS = 5;
const NUMBER_OF_MINERS = 10;
const NUMBER_OF_SPACE_BARS = 3;
const NUMBER_OF_SPACE_APARTMENTS = 3;

type SetGameAtion = {
  name: "set-game";
  payload: Game;
};

type GameAction = SetGameAtion;

type GameState = {
  game: Game | null;
  isLoading: boolean;
};

const initialState: GameState = {
  game: null,
  isLoading: true,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.name) {
    case "set-game": {
      return {
        ...state,
        game: action.payload,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
export const useGame = () => {
  //   const [game, setGame] = useState<Game | null>(null);
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

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

    game.start().then(() => {
      dispatch({ name: "set-game", payload: game });
    });
  }, []);

  return gameState;
};
