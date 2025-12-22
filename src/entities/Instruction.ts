import { Timer } from "excalibur";
import type { Game } from "./Game";
import { type MeepleAction } from "./Meeple";
import type { Condition } from "./types";

export class Instruction {
  game: Game;
  name: string;
  conditions: Condition[];
  actions: MeepleAction[];
  isValid: boolean;
  id: string;
  private timer: Timer | null = null;

  constructor(params: {
    id: string;
    name: string;
    game: Game;
    conditions: Condition[];
    actions: MeepleAction[];
  }) {
    this.id = params.id;
    this.game = params.game;
    this.name = params.name;
    this.conditions = params.conditions;
    this.actions = params.actions;
    this.isValid = this.evaluateConditions();
    this.startEvaluationTimer();
  }

  private startEvaluationTimer(): void {
    this.timer = new Timer({
      fcn: () => {
        this.isValid = this.evaluateConditions();
      },
      repeats: true,
      interval: 1000, // Evaluate once per second
    });
    this.game.currentScene.add(this.timer);
    this.timer.start();
  }

  evaluateConditions(): boolean {
    return this.conditions.every((condition) => condition());
  }

  destroy(): void {
    if (this.timer) {
      this.timer.cancel();
      this.timer = null;
    }
  }
}
