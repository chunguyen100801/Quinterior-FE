import { EventDispatcher } from 'three';
import { EVENT_KEY_PRESSED, EVENT_KEY_RELEASED } from '../model/constance';

export type KeyEvents = Record<
  typeof EVENT_KEY_PRESSED | typeof EVENT_KEY_RELEASED,
  { key: string; code: string }
>;

export class KeyboardManager {
  private _evenDispatch = new EventDispatcher<KeyEvents>();
  private static instance: KeyboardManager | undefined;
  private constructor() {}
  eventInit() {
    window.addEventListener('keydown', this.__keyDown);
    window.addEventListener('keyup', this.__keyUp);
  }
  static getIsntance() {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
      return KeyboardManager.instance;
    }
    return KeyboardManager.instance;
  }
  get evenDispatch() {
    return this._evenDispatch;
  }
  private __keyDown = (evt: KeyboardEvent) => {
    this.evenDispatch.dispatchEvent({
      type: EVENT_KEY_PRESSED,
      key: evt.key,
      code: evt.code,
    });
  };

  private __keyUp = (evt: KeyboardEvent) => {
    this.evenDispatch.dispatchEvent({
      type: EVENT_KEY_RELEASED,
      key: evt.key,
      code: evt.code,
    });
  };

  public cleanupEvent() {
    window.removeEventListener('keydown', this.__keyDown);
    window.removeEventListener('keyup', this.__keyUp);
    KeyboardManager.instance = undefined;
  }
}
