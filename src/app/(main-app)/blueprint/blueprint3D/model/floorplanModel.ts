import { saveFloorPlan } from '@/app/apis/projects.api';
import { ModelData } from 'src/types/asset.type';
import { EventDispatcher } from 'three';
import { TwoDView } from '../2d/2d';
import { twoDStore } from '../2d/2dStore';
import { ThreeDView } from '../3d/3d';
import { Item3D } from '../3d/graphics-element/items/Item3D';
import { CeillingItem } from '../3d/graphics-element/items/ceilling_item';
import { DecorateItem } from '../3d/graphics-element/items/decorate_item';
import { InWallItem } from '../3d/graphics-element/items/in_wall_item';
import { OnFloorItem } from '../3d/graphics-element/items/on_floor_item';
import { WallItem } from '../3d/graphics-element/items/wall_item';
import {
  BlueprintExternalInteract,
  EventData,
  saveLoadFloorPlanEvent,
} from '../blueprint';
import { Measure } from '../helper/measure';
import { ToastType } from './../../Blueprint';
import { cornerDisEpsilon } from './constance';
import { Corner } from './corner';
import { Room } from './room';
import { Wall } from './wall';

type coor = {
  x: number;
  y: number;
  z: number;
};
export type ItemSave = ModelData & {
  posMatrix: {
    rotation: coor;
    position: coor;
  };
};
type corner = {
  id: string;
  x: number;
  y: number;
};
type wall = {
  cornerIds: string[];
  thickNess: number; //cm
  wallHeight: number;
  wallItems: ItemSave[];
};
type room = {
  name: string;
  cornerIds: string[];
  roomItems: ItemSave[];
};
export type SavedFloorPlan = {
  corners: corner[];
  walls: wall[];
  rooms: room[];
  freeItems: ModelData[];
};
export type OptionsFloorPlan = {
  toast: ToastType;
};
export class FloorplanModel {
  public corners: Corner[];
  public walls: Wall[];
  public rooms: Map<string, Room>;
  private _viewer2D?: TwoDView;
  private _viewer3D?: ThreeDView;
  public freeItems: Item3D[] = [];
  private toast: ToastType;
  private externalEvent: EventDispatcher<BlueprintExternalInteract>;
  constructor(
    externalEvent: EventDispatcher<BlueprintExternalInteract>,
    optionsFloorPlan: OptionsFloorPlan
  ) {
    this.corners = [];
    this.walls = [];
    this.rooms = new Map<string, Room>();
    this.externalEvent = externalEvent;
    this.toast = optionsFloorPlan.toast;
    this.initEvent();
  }
  initEvent() {
    this.externalEvent.addEventListener(
      'export-floorplan',
      this.exportFloorPlan
    );
    this.externalEvent.addEventListener(
      'save-floorplan',
      this.saveFloorPlanOnline
    );
    this.externalEvent.addEventListener(
      'load-floorplan',
      this.loadExternalFloorPlan
    );

    this.externalEvent.addEventListener('reset-floorplan', this.resetFloorPlan);
  }

  cleanUpEvent() {
    this.externalEvent.removeEventListener(
      'export-floorplan',
      this.exportFloorPlan
    );
    this.externalEvent.removeEventListener(
      'save-floorplan',
      this.saveFloorPlanOnline
    );
    this.externalEvent.removeEventListener(
      'load-floorplan',
      this.loadExternalFloorPlan
    );
    this.externalEvent.removeEventListener(
      'reset-floorplan',
      this.resetFloorPlan
    );
  }

  addFreeItem = (item: Item3D) => {
    this.freeItems.push(item);
  };

  removeFreeItem = (itemToRemove: Item3D) => {
    this.freeItems = this.freeItems.filter((item) => item !== itemToRemove);
  };
  set viewer2D(viewer2D: TwoDView) {
    this._viewer2D = viewer2D;
  }

  set viewer3D(viewer3D: ThreeDView) {
    this._viewer3D = viewer3D;
  }
  private checkCornerIsOnLine(corner: Corner) {
    // there are no any duplicate wall
    for (const wall of this.walls) {
      if (
        Measure.isPointOnLineSegment(
          corner.coordinate,
          wall.associateCorners[0].coordinate!,
          wall.associateCorners[1].coordinate!
        )
      ) {
        return wall;
      }
    }
    return false;
  }
  addCornerWithNoDuplicate(x: number, y: number, id?: string) {
    const newCorner = new Corner(x, y, id);
    const result = this.checkExistCornerNeartoCorner(newCorner);
    if (result) {
      return result;
    }
    this.corners.push(newCorner);
    this.mergeWithIfOnWall(newCorner);
    this._viewer2D?.drawAddCorner(newCorner);
    // this.updateRooms();
    return newCorner;
  }

  private mergeWithIfOnWall(newCorner: Corner) {
    const wall = this.checkCornerIsOnLine(newCorner);
    if (wall) {
      //remove  current wall
      const index = this.walls.indexOf(wall);
      if (index != -1) {
        const deletedWall = this.walls.splice(index, 1)[0];
        deletedWall.view?.destroy();
        deletedWall.view3D?.cleanUpAll();
        deletedWall.wallItems?.forEach((item) => {
          if (item instanceof InWallItem || item instanceof WallItem)
            item.detachWall();
        });
        //remove corner
        for (const corner of deletedWall.associateCorners) {
          corner.detachWall(deletedWall);
        }
        //add 2 wall with corner in the middle
        deletedWall.associateCorners.forEach((corner, index) => {
          if (index == 0) {
            this.addNewWallWithNoDuplicate(corner, newCorner);
          }
          if (index == 1) {
            this.addNewWallWithNoDuplicate(newCorner, corner);
          }
        });
        deletedWall.associateCorners = [];
      }
    }
  }

  addNewWallWithNoDuplicate(
    startCorner: Corner,
    endCorner: Corner,
    thickNess?: number,
    wallHeight?: number
  ) {
    if (this.checkExistSameCornerWall([startCorner, endCorner])) {
      return;
    }
    const newWall = new Wall([startCorner, endCorner]);
    if (thickNess) newWall.thickNess = thickNess;
    if (wallHeight) newWall.wallHeight = wallHeight;
    startCorner.attachWall(newWall);
    endCorner.attachWall(newWall);
    this.walls.push(newWall);
    this._viewer2D?.drawAddWall(newWall);
    this._viewer3D?.drawAddWall3D(newWall);

    // this.updateRooms();
    return newWall;
  }
  private checkExistSameCornerWall(corners: Corner[]) {
    for (const wall of this.walls) {
      const associateCorners = wall.associateCorners;
      if (
        associateCorners.indexOf(corners[0]) != -1 &&
        associateCorners.indexOf(corners[1]) != -1
      ) {
        return true;
      }
    }
    return false;
  }

  private checkExistCornerNeartoCorner(corner: Corner) {
    const snapTolerance = twoDStore
      .getStore()
      .getValue('gridSpacing_snapTolerance');
    const isSnap = twoDStore.getStore().getValue('snapToGrid');
    for (let i = 0; i < this.corners.length; i++) {
      const existingCorner = this.corners[i];
      if (existingCorner == corner) continue;
      if (
        isSnap &&
        Measure.distance(existingCorner.coordinate, corner.coordinate) <
          snapTolerance
      ) {
        return existingCorner;
      }
      if (
        !isSnap &&
        Measure.distance(existingCorner.coordinate, corner.coordinate) <
          cornerDisEpsilon
      ) {
        return existingCorner;
      }
    }
    return null;
  }
  mergeCornerOnMove(corner: Corner) {
    const existCorner = this.checkExistCornerNeartoCorner(corner);
    if (existCorner) {
      // this.removeCorner(existCorner);
      const connectedWall = this.checkTwoCornerDirectlyConnectedByWall(
        existCorner,
        corner
      );

      if (connectedWall) {
        this.removeWall(connectedWall);
      }
    }

    const existCornerAfter = this.checkExistCornerNeartoCorner(corner);
    if (existCornerAfter && this.corners.indexOf(corner) != -1) {
      const deletedCorner = this.corners.splice(
        this.corners.indexOf(existCornerAfter),
        1
      )[0];
      const deletedWallCornerDirection: Map<Wall, number> = new Map();
      for (const wall of deletedCorner.associateWalls) {
        const indexCornerInWall = wall.associateCorners.indexOf(deletedCorner);
        wall.associateCorners.splice(indexCornerInWall, 1);
        deletedWallCornerDirection.set(wall, indexCornerInWall);
      }
      deletedCorner.view?.destroy();
      corner.associateWalls.push(...deletedCorner.associateWalls);

      deletedWallCornerDirection.forEach((direct, wall) => {
        if (direct == 1) {
          wall.associateCorners.push(corner);
        }
        if (direct == 0) {
          wall.associateCorners.unshift(corner);
        }
      });
      this.removerDuplicateWall();
    }
    // this.updateRooms();
  }
  private checkTwoCornerDirectlyConnectedByWall(
    corner1: Corner,
    corner2: Corner
  ) {
    for (const wall of this.walls) {
      if (
        wall.associateCorners.indexOf(corner1) != -1 &&
        wall.associateCorners.indexOf(corner2) != -1
      ) {
        return wall;
      }
    }
    return undefined;
  }
  private removerDuplicateWall() {
    const dubplicateWall = [];
    const walls = [...this.walls];
    for (let i = walls.length - 1; i >= 0; i--) {
      const wall = walls[i];
      for (let j = walls.length - 1; j >= 0; j--) {
        const wall2 = walls[j];
        if (wall2 !== wall) {
          const associateCorners = wall.associateCorners;
          if (
            associateCorners.indexOf(wall2.associateCorners[0]) !== -1 &&
            associateCorners.indexOf(wall2.associateCorners[1]) !== -1
          ) {
            dubplicateWall.push(walls.splice(walls.indexOf(wall2), 1)[0]);
            i--;
          }
        }
      }
    }

    for (const wall of dubplicateWall) {
      this.removeWall(wall);
    }
  }
  removeCorner(corner: Corner) {
    const index = this.corners.indexOf(corner);
    if (index != -1) {
      const deletedCorner = this.corners.splice(index, 1)[0];
      deletedCorner.view?.destroy();
      //one corner for one wall is impossiple delete wall too
      for (let i = deletedCorner.associateWalls.length - 1; i >= 0; i--) {
        const wall = deletedCorner.associateWalls[i];
        this.removeWall(wall);
      }

      return deletedCorner;
    }
    // this.updateRooms();
    return undefined;
  }
  removeWall(wall: Wall) {
    const index = this.walls.indexOf(wall);

    if (index != -1) {
      const deletedWall = this.walls.splice(index, 1)[0];

      deletedWall.view?.destroy();
      deletedWall.view3D?.cleanUpAll();
      //remove corner
      for (let i = deletedWall.associateCorners.length - 1; i >= 0; i--) {
        const corner = deletedWall.associateCorners[i];

        if (corner.associateWalls.length === 1) {
          this.removeCorner(corner);
        }

        if (corner.associateWalls.length > 1) {
          corner.detachWall(deletedWall);
        }
      }
      deletedWall.associateCorners = [];

      return deletedWall;
    }
    // this.updateRooms();
    return undefined;
  }

  private removeRoomThatCointansSmallerRoom(rooms: Corner[][]) {
    return rooms.filter((CurrentRoom) => {
      for (const room of rooms) {
        if (room == CurrentRoom) continue;
        const filterDuplicateCorners = room.filter(
          (corner) => CurrentRoom.indexOf(corner) == -1
        );
        if (filterDuplicateCorners.length == room.length) continue;
        // all corner of smaller room are corners of larger room
        if (filterDuplicateCorners.length == 0) {
          for (let i = 0, j = room.length - 1; i < room.length; j = i++) {
            const middlePoint = Measure.getMiddlePoint(
              room[i].coordinate,
              room[j].coordinate
            );
            if (
              Measure.checkPointisInsidePolygon(
                middlePoint,
                CurrentRoom.map((corner) => corner.coordinate)
              ) == false
            ) {
              return false;
            }
          }
        }
        //partly corner of smaller room are corners opf larger room
        for (const corner of filterDuplicateCorners) {
          if (
            Measure.checkPointisInsidePolygon(
              corner.coordinate,
              CurrentRoom.map((corner) => corner.coordinate)
            ) == false
          ) {
            //outside
            return false;
          }
        }
      }
      return true;
    });
  }
  private removeRoomThatCointansSmallerRoom2(rooms: Corner[][]) {
    // create map
    const map = new Map<Corner, number[]>(); // corner and room indexnumber in Rooms
    for (let i = 0; i < rooms.length; i++) {
      for (const corner of rooms[i]) {
        const arr = map.get(corner);
        if (arr) {
          arr.push(i);
        } else {
          map.set(corner, [i]);
        }
      }
    }

    return rooms.filter((CurrentRoom) => {
      //find assoiciate room with current room
      const accsoicateRoom = [];
      for (const corner of CurrentRoom) {
        const indexs = map.get(corner);
        if (!indexs) continue;
        for (const i of indexs) {
          accsoicateRoom.push(rooms[i]);
        }
      }

      for (const room of accsoicateRoom) {
        if (room == CurrentRoom) continue;
        const filterDuplicateCorners = room.filter(
          (corner) => CurrentRoom.indexOf(corner) == -1
        );
        if (filterDuplicateCorners.length == room.length) continue;
        // all corner of smaller room are corners of larger room
        if (filterDuplicateCorners.length == 0) {
          for (let i = 0, j = room.length - 1; i < room.length; j = i++) {
            const middlePoint = Measure.getMiddlePoint(
              room[i].coordinate,
              room[j].coordinate
            );
            if (
              Measure.checkPointisInsidePolygon(
                middlePoint,
                CurrentRoom.map((corner) => corner.coordinate)
              ) == true
            ) {
              return false;
            }
          }
        }
        //partly corner of smaller room are corners opf larger room
        for (const corner of filterDuplicateCorners) {
          if (
            Measure.checkPointisInsidePolygon(
              corner.coordinate,
              CurrentRoom.map((corner) => corner.coordinate)
            ) == true
          ) {
            //outside
            return false;
          }
        }
      }
      return true;
    });
  }

  private removeDuplicateRooms(roomArray: Corner[][]) {
    const results = [];
    const lookup = new Map<string, boolean>();
    for (const room of roomArray) {
      const str = room
        .slice()
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((corner) => corner.id)
        .join('-');
      if (lookup.get(str)) {
        //empty
      } else {
        lookup.set(str, true);
        results.push(room);
      }
    }
    return results;
  }
  detecAllRoom2() {
    // Define a helper function for DFS
    const dfs = (
      currentCorner: Corner,
      previousCorner: Corner,
      visited: Map<Corner, boolean>,
      startCorner: Corner,
      startPreviousCorner: Corner
    ) => {
      visited.set(currentCorner, true);
      const nextCorners = currentCorner.associateCorners.filter(
        (corner) => corner !== previousCorner
      );

      for (const nextCorner of nextCorners) {
        if (
          visited.has(nextCorner) &&
          nextCorner === startCorner &&
          currentCorner !== startPreviousCorner
        ) {
          continue;
        }
        if (
          visited.has(nextCorner) &&
          nextCorner === startCorner &&
          currentCorner === startPreviousCorner
        ) {
          rooms.push(Array.from(visited.keys()));
        }
        if (!visited.has(nextCorner)) {
          dfs(
            nextCorner,
            currentCorner,
            visited,
            startCorner,
            startPreviousCorner
          );
        }
      }
      visited.delete(currentCorner);
    };

    let rooms: Corner[][] = [];

    for (const wall of this.walls) {
      const startCorner = wall.associateCorners[1];
      const previousStartCorner = wall.associateCorners[0];
      dfs(
        startCorner,
        previousStartCorner,
        new Map(),
        startCorner,
        previousStartCorner
      );
    }

    rooms = this.removeDuplicateRooms(rooms);

    rooms = this.removeRoomThatCointansSmallerRoom2(rooms);

    return rooms;
  }
  detecAllRoom3() {
    // Define a helper function for DFS
    const nextArea = (
      previousArea: number,
      currentCorner: Corner,
      previousCorner: Corner
    ) => {
      previousArea += currentCorner.coordinate.x * previousCorner.coordinate.y;
      previousArea -= currentCorner.coordinate.y * previousCorner.coordinate.x;

      return previousArea;
    };
    const getCurrentArea = (
      doubleArea: number,
      nextCorner: Corner,
      currentCorner: Corner,
      startPreviousCorner: Corner
    ) =>
      Math.abs(
        nextArea(
          nextArea(doubleArea, nextCorner, currentCorner),
          startPreviousCorner,
          nextCorner
        ) * 0.5
      );

    const dfs = (
      currentCorner: Corner,
      previousCorner: Corner,
      visited: Map<Corner, boolean>,
      startCorner: Corner,
      startPreviousCorner: Corner,
      previousArea: number
    ) => {
      visited.set(currentCorner, true);
      const nextCorners = currentCorner.associateCorners.filter(
        (corner) => corner !== previousCorner
      );

      //area
      const doubleArea = nextArea(previousArea, currentCorner, previousCorner);
      const realArea = Math.abs(doubleArea * 0.5);
      //sortby next area
      nextCorners.sort((a, b) => {
        return (
          getCurrentArea(doubleArea, a, currentCorner, startPreviousCorner) -
          getCurrentArea(doubleArea, b, currentCorner, startPreviousCorner)
        );
      });

      for (const nextCorner of nextCorners) {
        if (
          visited.has(nextCorner) &&
          nextCorner === startCorner &&
          currentCorner !== startPreviousCorner
        ) {
          continue;
        }
        if (
          visited.has(nextCorner) &&
          nextCorner === startCorner &&
          currentCorner === startPreviousCorner
        ) {
          rooms.push(Array.from(visited.keys()));
          currentSmallestAera = realArea;
        }
        if (!visited.has(nextCorner)) {
          if (
            getCurrentArea(
              doubleArea,
              nextCorner,
              currentCorner,
              startPreviousCorner
            ) <= currentSmallestAera
          ) {
            dfs(
              nextCorner,
              currentCorner,
              visited,
              startCorner,
              startPreviousCorner,
              doubleArea
            );
          }
        }
      }
      visited.delete(currentCorner);
    };

    let rooms: Corner[][] = [];
    let currentSmallestAera = Infinity;
    for (const wall of this.walls) {
      // if (!this.walls[0]) return [];
      const startCorner = wall.associateCorners[1];
      const previousStartCorner = wall.associateCorners[0];

      dfs(
        startCorner,
        previousStartCorner,
        new Map(),
        startCorner,
        previousStartCorner,
        0
      );
      currentSmallestAera = Infinity;
    }

    rooms = this.removeDuplicateRooms(rooms);

    rooms = this.removeRoomThatCointansSmallerRoom2(rooms);

    return rooms;
  }

  private findWall(corner1: Corner, corner2: Corner) {
    // walls are ensure that they dont duplicate
    return this.walls.find(
      (wall) =>
        wall.associateCorners.indexOf(corner1) != -1 &&
        wall.associateCorners.indexOf(corner2) != -1
    );
  }
  private updateRoomItemPosError(newRoom: Room) {
    if (!newRoom.roomItems) return;
    for (let i = newRoom.roomItems.length - 1; i >= 0; i--) {
      const item = newRoom.roomItems[i];
      if (
        item instanceof OnFloorItem ||
        item instanceof DecorateItem ||
        item instanceof CeillingItem
      ) {
        if (
          !Measure.polygonInPolygon(
            item.getFloorItemFloorPolygon(),
            newRoom.getRoomPolygon()
          )
        ) {
          // item.detachRoom();
          item.showError();
        } else {
          item.removeError();
          // item.detachRoom();
          // item.attachRoom(this);
        }
      }
    }
  }

  updateRooms() {
    const oldRoomsMap = new Map(this.rooms);
    const oldRoomsClone = new Map(this.rooms);

    this.rooms.clear();
    for (const roomCorners of this.detecAllRoom2()) {
      const oldRoomId = Room.createId(roomCorners);
      const oldRoom = oldRoomsClone.get(oldRoomId);
      let newRoom;
      if (oldRoom) {
        newRoom = new Room(roomCorners).copyRoom(oldRoom);
        oldRoomsClone.delete(oldRoomId);
      } else {
        newRoom = new Room(roomCorners);
      }
      //check for olditem item position
      this.updateRoomItemPosError(newRoom);
      this.rooms.set(newRoom.id, newRoom);
    }
    // old room not exit anymore
    Array.from(oldRoomsClone).forEach((oldRoom) => {
      if (!oldRoom[1].roomItems) return;
      for (let i = oldRoom[1].roomItems.length - 1; i >= 0; i--) {
        const item = oldRoom[1].roomItems[i];
        if (item instanceof OnFloorItem) {
          item.detachRoom();
          item.showError();
        }
      }
    });

    // delete all current wallroom
    this.walls.forEach((wall) => {
      wall.clearAllAttachRoom();
    });
    //update new wall attach rooms
    this.rooms.forEach((room) => {
      const length = room.corners.length;
      for (let i = 0, j = length - 1; i < length; j = i++) {
        const wall = this.findWall(room.corners[i], room.corners[j]);
        wall?.addAttachRoom(room);
        wall?.updatePerDirectionToPointOutRoom();
      }
    });
    //update edgge
    this.corners.forEach((corner) => {
      corner.updateEdge();
    });
    this.walls.forEach((wall) => {
      wall?.view?.drawNormalState();
      wall?.view3D?.updateDraw();
    });
    // console.log(this.rooms, 'lastest');
    //update view
    const currentRooms = Array.from(this.rooms).map((el) => el[1]);
    const oldRooms = Array.from(oldRoomsMap).map((el) => el[1]);
    this._viewer2D?.drawRoomUpdate(oldRooms, currentRooms);
    this._viewer3D?.drawRoom3DUpdate(oldRooms, currentRooms);
  }

  saveFloorPlan() {
    const saveFile: SavedFloorPlan = {
      corners: [],
      walls: [],
      rooms: [],
      freeItems: [],
    };
    this.corners.forEach((corner) => {
      saveFile.corners.push({
        id: corner.id,
        x: corner.coordinate.x,
        y: corner.coordinate.y,
      });
    });

    this.walls.forEach((wall) => {
      const itemMetaArray = wall.wallItems?.map((item) => ({
        ...item.metadata,
        posMatrix: {
          rotation: {
            x: item.rotation.x,
            y: item.rotation.y,
            z: item.rotation.z,
          },
          position: {
            x: item.position.x,
            y: item.position.y,
            z: item.position.z,
          },
        },
      }));

      saveFile.walls.push({
        cornerIds: [wall.associateCorners[0].id, wall.associateCorners[1].id],
        thickNess: wall.thickNess, //cm
        wallHeight: wall.wallHeight,
        wallItems: itemMetaArray ? itemMetaArray : [],
      });
    });
    this.rooms.forEach((room) => {
      const itemMetaArray = room.roomItems?.map((item) => ({
        ...item.metadata,
        posMatrix: {
          rotation: {
            x: item.rotation.x,
            y: item.rotation.y,
            z: item.rotation.z,
          },
          position: {
            x: item.position.x,
            y: item.position.y,
            z: item.position.z,
          },
        },
      }));
      const cornerIds = room.corners.map((corner) => corner.id);
      saveFile.rooms.push({
        cornerIds: cornerIds,
        roomItems: itemMetaArray ? itemMetaArray : [],
        name: room.name,
      });
    });
    this.freeItems.forEach((item) => {
      saveFile.freeItems.push(item.metadata);
    });

    return saveFile;
  }

  public saveFloorPlanOnline = async (
    event: EventData<saveLoadFloorPlanEvent, 'save-floorplan'>
  ) => {
    const toastId = this.toast.loading(`Saving in progess...`);
    try {
      this.toast;
      const id = event.id;
      const saveFile = this.saveFloorPlan();
      this;
      await saveFloorPlan(id, saveFile);
      this.toast.success(`Your work is saved`, {
        id: toastId,
      });
    } catch (err) {
      console.log(err);
      this.toast.error(`Failed save model !`, {
        id: toastId,
        description: `There is something wrong`,
      });
    }
  };

  public exportFloorPlan = (
    event: EventData<saveLoadFloorPlanEvent, 'export-floorplan'>
  ) => {
    const name = event.name.replace(' ', '-').toLowerCase();
    const saveFile = this.saveFloorPlan();

    const saveFileJSON = JSON.stringify(saveFile, null, 2); //
    const blob = new Blob([saveFileJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  loadExternalFloorPlan = async (
    event: EventData<saveLoadFloorPlanEvent, 'load-floorplan'>
  ) => {
    try {
      this.resetFloorPlan();
      await this.loadFloorPlan(event.externalFloorplan);
    } catch (err) {
      console.log(err);
    }
  };
  public loadFloorPlan = async (savedFloorPlan: SavedFloorPlan) => {
    try {
      this.externalEvent.dispatchEvent({ type: 'start-load-3d' });
      this.resetFloorPlan();

      const floorPlan: SavedFloorPlan = savedFloorPlan;
      const cornersMap = new Map<string, Corner>();
      const wallItemMap = new Map<ItemSave, Wall>();
      const roomItemMap = new Map<ItemSave, Room>();
      for (const corner of floorPlan.corners) {
        const newCorner = this.addCornerWithNoDuplicate(
          corner.x,
          corner.y,
          corner.id
        );
        cornersMap.set(newCorner.id, newCorner);
      }
      for (const wall of floorPlan.walls) {
        const firstCorner = cornersMap.get(wall.cornerIds[0]);
        const secondCorner = cornersMap.get(wall.cornerIds[1]);
        if (firstCorner && secondCorner) {
          const newWall = this.addNewWallWithNoDuplicate(
            firstCorner,
            secondCorner,
            wall.thickNess,
            wall.wallHeight
          );
          if (!newWall) {
            throw Error('Duplicate walls on save');
          }
          for (const item of wall.wallItems) {
            wallItemMap.set(item, newWall);
          }
        }
      }
      for (const room of floorPlan.rooms) {
        const cornersArray = room.cornerIds.map((cornerId) => {
          const cornerModel = this.corners.find(
            (corner) => corner.id == cornerId
          );
          if (!cornerModel) throw new Error('Create room error!');
          return cornerModel;
        });

        const newRoom = new Room(cornersArray, room.name);
        this;
        this.rooms.set(newRoom.id, newRoom);
        for (const item of room.roomItems) {
          roomItemMap.set(item, newRoom);
        }
      }
      this.rooms.forEach((room) => {
        const length = room.corners.length;
        for (let i = 0, j = length - 1; i < length; j = i++) {
          const wall = this.findWall(room.corners[i], room.corners[j]);
          wall?.addAttachRoom(room);
          wall?.updatePerDirectionToPointOutRoom();
          wall?.view?.drawNormalState();
          wall?.view3D?.updateDraw();
        }
      });
      const currentRooms = Array.from(this.rooms).map((el) => el[1]);
      this._viewer2D?.drawRoomUpdate([], currentRooms);
      this._viewer3D?.drawRoom3DUpdate([], currentRooms);
      //update edge
      this.corners.forEach((corner) => {
        corner.updateEdge();
      });
      this.walls.forEach((wall) => {
        wall?.view?.drawNormalState();
        wall?.view3D?.updateDraw();
      });
      await this._viewer3D?.addItemOnLoad(
        wallItemMap,
        roomItemMap,
        savedFloorPlan.freeItems
      );

      this.externalEvent.dispatchEvent({ type: 'loaded-all-3d' });
    } catch (err) {
      if (err instanceof Error) {
        this.toast.error(err.message);
        // this.externalEvent.dispatchEvent({ type: 'fail-load-3d' });
        console.log(err);
      }
    }
    //
  };
  resetFloorPlan = () => {
    this.rooms.forEach((room) => {
      room.roomView3D?.cleanUpAll();
      room.roomView3D = undefined;
      room.view2D?.destroy();
      for (const item of room.roomItems ? room.roomItems : []) {
        item.deleteModel();
      }
      room.roomItems = [];
    });
    this.walls.forEach((wall) => {
      wall.view?.destroy();
      wall.view3D?.cleanUpAll();
      wall.view3D = undefined;
      for (const item of wall.wallItems ? wall.wallItems : []) {
        item.deleteModel();
      }
      wall.wallItems = [];
    });
    this.corners.forEach((corner) => {
      corner.view?.destroy();
    });

    this.cleanUpFloorPlan();
  };
  cleanUpFloorPlan = () => {
    this.corners = [];
    this.walls = [];
    this.rooms.clear();
    this.freeItems = [];
  };
}
