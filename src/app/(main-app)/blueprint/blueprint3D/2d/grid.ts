import { Graphics } from 'pixi.js';
import { Measure } from '../helper/measure';
import { Color2D, ZindezViewPort } from '../model/constance';
import { StoreEventsKey, twoDStore } from './2dStore';

export class Grid2D extends Graphics {
  private store: twoDStore;
  constructor() {
    super();
    this.store = twoDStore.getStore();

    this.pivot.x = this.pivot.y = 0.5;
    this.zIndex = ZindezViewPort.grid2d;
    this.drawGrid();
    this.initEvent();
  }
  initEvent() {
    twoDStore.eventDispatch.addEventListener<StoreEventsKey>(
      'gridScale-change',
      this.drawGrid
    );
    twoDStore.eventDispatch.addEventListener<StoreEventsKey>(
      'MeasurementUnit-change',
      this.drawGrid
    );
    twoDStore.eventDispatch.addEventListener<StoreEventsKey>(
      'gridSpacing_snapTolerance-change',
      this.drawGrid
    );

    twoDStore.eventDispatch.addEventListener<StoreEventsKey>(
      'BaseSnapUnit-change',
      this.drawGrid
    );
  }
  cleanUpEvent() {
    twoDStore.eventDispatch.removeEventListener<StoreEventsKey>(
      'gridScale-change',
      this.drawGrid
    );
    twoDStore.eventDispatch.removeEventListener<StoreEventsKey>(
      'MeasurementUnit-change',
      this.drawGrid
    );
    twoDStore.eventDispatch.removeEventListener<StoreEventsKey>(
      'gridSpacing_snapTolerance-change',
      this.drawGrid
    );
    twoDStore.eventDispatch.removeEventListener<StoreEventsKey>(
      'BaseSnapUnit-change',
      this.drawGrid
    );
  }
  private drawGrid = () => {
    const gridSize = Measure.cmToPixel(this.store.getValue('gridSize'));

    const gridScale = this.store.getValue('gridScale');
    const spacingCMS = this.store.getValue('gridSpacing_snapTolerance');

    const spacing = Measure.cmToPixel(spacingCMS);
    const totalLines = spacing != 0 ? gridSize / spacing : 0;
    const halfSize = gridSize * 0.5;
    const linewidth = Math.max(1.0 / gridScale, 1.0);
    const highlightLineWidth = Math.max(2.0 / gridScale, 1.0);
    this.clear();
    for (let i = 0; i < totalLines; i++) {
      const co = i * spacing - halfSize;
      if (i % 5 === 0) {
        this.lineStyle(highlightLineWidth, Color2D.gridHighLightLine.color)
          .moveTo(-halfSize, co)
          .lineTo(halfSize, co);
        this.lineStyle(highlightLineWidth, Color2D.gridHighLightLine.color)
          .moveTo(co, -halfSize)
          .lineTo(co, halfSize);
      } else {
        this.lineStyle(linewidth, Color2D.gridNormalLine.color)
          .moveTo(-halfSize, co)
          .lineTo(halfSize, co);
        this.lineStyle(linewidth, Color2D.gridNormalLine.color)
          .moveTo(co, -halfSize)
          .lineTo(co, halfSize);
      }
    }
    this.beginFill(Color2D.originCord.color, Color2D.originCord.alpha);
    this.drawCircle(0, 0, Math.max(5 / gridScale, 5));
  };
}
