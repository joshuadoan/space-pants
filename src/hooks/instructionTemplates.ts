import {
  Meeple,
  MeepleActionType,
  MeepleStateType,
  MiningType,
  type MeepleActionFinish,
  type MeepleActionSetRandomTargetByRoleId,
  type MeepleActionSetTarget,
  type MeepleActionTransact,
  type MeepleActionTravelTo,
} from "../entities/Meeple";
import { RoleId } from "../entities/types";

export const SetRandomTargetByRoleId = (roleId: RoleId) => ({
  type: MeepleActionType.SetRandomTargetByRoleId,
  payload: {
    roleId: roleId,
  },
} as MeepleActionSetRandomTargetByRoleId);

export const SetTarget = (target: Meeple) => ({
  type: MeepleActionType.SetTarget,
  payload: {
    target: target,
  },
} as MeepleActionSetTarget);

export const TravelToAsteroid = {
  type: MeepleActionType.TravelTo,
  payload: {},
} as MeepleActionTravelTo;

export const AddOreToMinerInventory = (miner: Meeple) =>
  ({
    type: MeepleActionType.Transact,
    payload: {
      good: MiningType.Ore,
      quantity: 1,
      transactionType: "add",
      target: miner,
    },
  } as MeepleActionTransact);

export const RemoveOreFromAsteroid = {
  type: MeepleActionType.Transact,
  payload: {
    good: MiningType.Ore,
    quantity: 1,
    transactionType: "remove",
  },
} as MeepleActionTransact

export const Finish = {
  type: MeepleActionType.Finish,
  payload: {
    state: {
      type: MeepleStateType.Idle,
      target: undefined,
    },
  },
} as MeepleActionFinish;
