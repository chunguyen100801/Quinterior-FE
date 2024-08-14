import { EventDispatcher } from 'three';
import { Measure } from '../helper/measure';
import {
  BASE_GRID_SIZE,
  MeasurementUnits,
  defaultStore,
} from '../model/constance';

export type Store2D = {
  gridScale: number;
  gridSpacing_snapTolerance: number;
  gridSize: number;
  snapToGrid: boolean;
  MeasurementUnit: MeasurementUnits;
  BaseSnapUnit: MeasurementUnits;
};

export type StoreEvents = {
  [K in keyof Store2D as `${string & K}-change`]: object;
};

export type StoreEventsKey = keyof StoreEvents;
export class twoDStore {
  private static store = new twoDStore();
  static eventDispatch = new EventDispatcher<StoreEvents>();
  private data: Store2D = { ...defaultStore };
  private constructor() {}
  static getStore() {
    if (this.store) {
      return this.store;
    } else {
      twoDStore.store = new twoDStore();
      return twoDStore.store;
    }
  }

  setValue<K extends keyof Store2D>(key: K, newValue: Store2D[K]) {
    if (key in this.data) {
      if (key == 'BaseSnapUnit') {
        const previousUnit = this.data[key];
        this.data.gridSpacing_snapTolerance = Measure.UnitToCm(
          Measure.cmToUnit(
            twoDStore.store.getValue('gridSpacing_snapTolerance'),
            previousUnit as MeasurementUnits
          ),
          newValue as MeasurementUnits
        );
        const round = Math.floor(
          BASE_GRID_SIZE / this.data.gridSpacing_snapTolerance
        ); // make center to snap in grid no matter what mod
        this.data.gridSize =
          (round % 2 == 0 ? round : round + 1) *
          this.data.gridSpacing_snapTolerance;
        this.data[key] = newValue;
        twoDStore.eventDispatch.dispatchEvent({ type: `${key}-change` });
        return;
      }
      if (key == 'gridSpacing_snapTolerance') {
        const newValueInCm = Measure.UnitToCm(
          newValue as number,
          this.data.BaseSnapUnit
        );
        const round = Math.floor(BASE_GRID_SIZE / newValueInCm); // make center to snap in grid no matter what mod
        this.data.gridSize =
          (round % 2 == 0 ? round : round + 1) * newValueInCm;
        this.data[key] = newValueInCm as Store2D[K];
        twoDStore.eventDispatch.dispatchEvent({ type: `${key}-change` });
        return;
      }

      this.data[key] = newValue;
      twoDStore.eventDispatch.dispatchEvent({ type: `${key}-change` });
    } else {
      throw new Error(`Invalid key: ${key}`);
    }
  }

  getValue<K extends keyof Store2D>(key: K): Store2D[K] {
    if (key in this.data) {
      return this.data[key];
    } else {
      throw new Error(`Invalid key: ${key}`);
    }
  }
}
