import { useEffect, useReducer, useRef } from "react";
import type { Game } from "../entities/Game";
import type { Actor } from "excalibur";
import { Meeple } from "../entities/Meeple";


type GameEntitiesState = {
  meeples: Meeple[];
};

type GameEntitiesAction = {
  type: "set-meeples";
  payload: Meeple[];
};

type Action = GameEntitiesAction;

export const useGameEntities = (game: Game | null) => {
  const gameRef = useRef<Game | null>(null);
  
  const [state, dispatch] = useReducer((state: GameEntitiesState, action: Action) => {
    switch (action.type) {
      case "set-meeples": {
        return {
          ...state,
          meeples: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  }, {
    meeples: [],
  });

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = game;
    }

    const interval = setInterval(() => {
      if (gameRef.current) {
        const actors = gameRef.current.currentScene.actors;
        const meeples = actors.filter((actor: Actor) => actor instanceof Meeple);
        dispatch({ type: "set-meeples", payload: meeples });
      } 
    }, 300);

    return () => clearInterval(interval);
  }, [game]);

  return {
    gameRef,
    state,
  };
};

