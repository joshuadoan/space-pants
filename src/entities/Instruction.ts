import type { Game } from "./Game";
import { MeepleActionType, type Meeple, type MeepleAction } from "./Meeple";
import type { Condition } from "./types";

export class Instruction {
  game: Game;
  name: string;
  conditions: Condition[];
  actions: MeepleAction[];
  isValid: boolean;  
  id: string;

  constructor(params: {
    id: string;
    name: string;
    game: Game;
    conditions: (() => boolean)[];
    actions: MeepleAction[];
  }) {
    this.id = params.id;
    this.game = params.game;
    this.name = params.name;
    this.conditions = params.conditions;
    this.actions = params.actions;
    this.isValid = this.conditions.every((condition) => condition());
  }
}
