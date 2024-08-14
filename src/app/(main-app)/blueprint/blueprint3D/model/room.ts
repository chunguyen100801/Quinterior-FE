import { z } from 'zod';
import { RoomView } from '../2d/graphics-elements/roomView';
import { Item3D } from '../3d/graphics-element/items/Item3D';
import { RoomView3D } from '../3d/graphics-element/room/RoomView3D';
import {
  ObjectModify,
  ObjectModifyInterface,
  ObjectType,
} from '../helper/objectModifyManager';
import { Corner } from './corner';

export class Room implements ObjectModifyInterface {
  private _corners: Corner[];
  private _view2D: RoomView | undefined;
  private _roomView3D: RoomView3D | undefined;
  public name: string;
  public id: string;
  private _roomItem: Item3D[] | undefined = [];
  constructor(corners: Corner[], name?: string) {
    this._corners = corners;
    this.id = Room.createId(corners);
    this.name = name ? name : 'New Room';
  }
  addRoomItem = (newRoomItem: Item3D) => {
    this._roomItem?.push(newRoomItem);
  };
  removeItem = (_roomItem: Item3D) => {
    const index = this._roomItem?.indexOf(_roomItem);
    if (index != -1 && index != undefined) {
      this._roomItem?.splice(index, 1);
    }
  };

  getRoomPolygon() {
    return this._corners.map((corner) => corner.coordinate);
  }
  copyRoom(oldRoom: Room) {
    this.name = oldRoom.name;

    this._roomItem = oldRoom._roomItem;

    return this;
    // some propotyties
  }
  static createId(corners: Corner[]) {
    return corners
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((corner) => corner.id)
      .join('-');
  }
  set view2D(roomView: RoomView | undefined) {
    this._view2D = roomView;
  }
  get roomItems(): Item3D[] | undefined {
    return this._roomItem;
  }
  set roomItems(items: Item3D[] | undefined) {
    this._roomItem = items;
  }
  get view2D(): RoomView | undefined {
    return this._view2D;
  }
  set roomView3D(roomView3D: RoomView3D | undefined) {
    this._roomView3D = roomView3D;
  }
  get roomView3D(): RoomView3D | undefined {
    return this._roomView3D;
  }

  get corners(): Corner[] {
    return this._corners;
  }
  getObjectModify(): ObjectModify {
    return {
      itemType: 'Room' as ObjectType,
      modifyInfo: {
        area: {
          value: this.view2D!.textArea!,
          display: 'show',
        },
        name: {
          value: this.name,
          display: 'text-box',
        },
      },
      zod: z.object({
        name: z
          .string()
          .min(1, { message: 'Room name cant be emty' })
          .max(20, { message: 'Room name is too long' }),
      }),
    };
  }
  applyObjectModify = (data: { [x: string]: unknown }) => {
    if (typeof data === 'object') {
      const allowedKeys = ['name'] as const;
      type AllowedKeys = (typeof allowedKeys)[number];
      for (const key in data) {
        if (allowedKeys.includes(key as AllowedKeys)) {
          this[key as AllowedKeys] = data[key] as Room[AllowedKeys];
        }
      }
    }
    this.view2D?.drawRoom();
  };
}
