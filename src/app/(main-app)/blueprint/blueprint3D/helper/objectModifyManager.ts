import { EventDispatcher } from 'three';
export type objectValue = {
  value: number | boolean | string;
  display: 'show' | 'text-box' | 'number-input' | 'check-box' | 'slider';
};
export type ObjectType = 'Wall' | 'Corner' | 'Room';
export type ObjectModify = {
  itemType: ObjectType;
  modifyInfo: { [key in Exclude<string, 'type'>]: objectValue };
  zod: Zod.AnyZodObject;
};

export type EditEvents = {
  [K in ObjectType as `${string & K}-change`]: ObjectModify;
} & { newItemSelect: ObjectModify };

export interface ObjectModifyInterface {
  getObjectModify(): ObjectModify;
  applyObjectModify(data: { [x: string]: unknown }): void;
}

export class ObjectModifyManager {
  public object: ObjectModify | null = null;
  public selectedRefFloolplanObject: ObjectModifyInterface | null = null;
  private _evenDispatch = new EventDispatcher<EditEvents>();
  private constructor() {}
  private static instance: ObjectModifyManager | undefined;
  static getIsntance() {
    if (!ObjectModifyManager.instance) {
      ObjectModifyManager.instance = new ObjectModifyManager();
      return ObjectModifyManager.instance;
    }
    return ObjectModifyManager.instance;
  }
  setObject = (selectedRefFloolplanObject: ObjectModifyInterface) => {
    this.selectedRefFloolplanObject = selectedRefFloolplanObject;
    this.evenDispatch.dispatchEvent({
      type: 'newItemSelect',
      ...selectedRefFloolplanObject.getObjectModify(),
    });
  };
  applyObject = (data: { [x: string]: unknown }): void => {
    this.selectedRefFloolplanObject?.applyObjectModify(data);
  };
  get modifyObject() {
    return this.object;
  }
  get evenDispatch() {
    return this._evenDispatch;
  }
}
