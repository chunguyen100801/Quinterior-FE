// export class RotateHUb {
//     private  any;
//     private scene: Scene;
//     private selectedItem: any = null;
//     private rotating: boolean = false;
//     private mouseover: boolean = false;
//     private activeObject: Object3D | null = null;
//     private tolerance: number = 10;
//     private height: number = 5;
//     private distance: number = 20;
//     private color: string = "#ffffff";
//     private hoverColor: string = "#f1c40f";

//     constructor  any) {
//         this =
//         this.scene = new Scene();
//         this.init();
//     }

//     public getScene(): Scene {
//         return this.scene;
//     }

//     public getObject(): Object3D | null {
//         return this.activeObject;
//     }

//     private init() {
//         this itemSelectedCallbacks.add(this.itemSelected);
//         this itemUnselectedCallbacks.add(this.itemUnselected);
//     }

//     private resetSelectedItem() {
//         this.selectedItem = null;
//         if (this.activeObject) {
//             this.scene.remove(this.activeObject);
//             this.activeObject = null;
//         }
//     }

//     private itemSelected = (item: any) => {
//         if (this.selectedItem != item) {
//             this.resetSelectedItem();
//             if (item.allowRotate && !item.fixed) {
//                 this.selectedItem = item;
//                 this.activeObject = this.makeObject(this.selectedItem);
//                 this.scene.add(this.activeObject);
//             }
//         }
//     }

//     private itemUnselected = () => {
//         this.resetSelectedItem();
//     }

//     public setRotating(isRotating: boolean) {
//         this.rotating = isRotating;
//         this.setColor();
//     }

//     public setMouseover(isMousedOver: boolean) {
//         this.mouseover = isMousedOver;
//         this.setColor();
//     }

//     private setColor() {
//         if (this.activeObject) {
//             this.activeObject.children.forEach((obj: any) => {
//                 obj.material.color.set(this.getColor());
//             });
//         }
//         this needsUpdate();
//     }

//     private getColor() {
//         return (this.mouseover || this.rotating) ? this.hoverColor : this.color;
//     }

//     public update() {
//         if (this.activeObject) {
//             if (this.selectedItem) {
//                 this.activeObject.rotation.y = this.selectedItem.rotation.y;
//                 this.activeObject.position.x = this.selectedItem.position.x;
//                 this.activeObject.position.z = this.selectedItem.position.z;
//             }
//         }
//     }

//     private makeLineGeometry(item: any) {
//         var geometry = new Geometry();
//         geometry.vertices.push(
//             new Vector3(0, 0, 0),
//             this.rotateVector(item)
//         );
//         return geometry;
//     }

//     private rotateVector(item: any) {
//         var vec = new Vector3(0, 0,
//             Math.max(item.halfSize.x, item.halfSize.z) + 1.4 + this.distance);
//         return vec;
//     }

//     private makeLineMaterial(rotating: boolean) {
//         var mat = new LineBasicMaterial({
//             color: this.getColor(),
//             linewidth: 3
//         });
//         return mat;
//     }

//     private makeCone(item: any) {
//         var coneGeo = new CylinderGeometry(5, 0, 10);
//         var coneMat = new MeshBasicMaterial({
//             color: this.getColor()
//         });
//         var cone = new Mesh(coneGeo, coneMat);
//         cone.position.copy(this.rotateVector(item));
//         cone.rotation.x = -Math.PI / 2.0;
//         return cone;
//     }

//     private makeSphere(item: any) {
//         var geometry = new SphereGeometry(4, 16, 16);
//         var material = new MeshBasicMaterial({
//             color: this.getColor()
//         });
//         var sphere = new Mesh(geometry, material);
//         return sphere;
//     }

//     private makeObject(item: any) {
//         var object = new Object3D();
//         var line = new Line(
//             this.makeLineGeometry(item),
//             this.makeLineMaterial(this.rotating),
//          LinePieces);
//         var cone = this.makeCone(item);
//         var sphere = this.makeSphere(item);
//         object.add(line);
//         object.add(cone);
//         object.add(sphere);
//         object.rotation.y = item.rotation.y;
//         object.position.x = item.position.x;
//         object.position.z = item.position.z;
//         object.position.y = this.height;
//         return object;
//     }
// }
// }
