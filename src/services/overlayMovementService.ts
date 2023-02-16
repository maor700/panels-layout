import { Subject, Subscription } from 'rxjs';

const style = `
position: absolute;
height: 100vh;
width: 100vw;
top: 0;
left: 0;
display:block;
z-index: 100000000;
display:none;
opacity: 0.4;
background:red
`;

export class OverlayMouseMovement {
  overlayElm: HTMLElement;
  targetWindow: Window;
  containerId: string;
  movements$ = new Subject<MouseEvent>();
  moveEnd$ = new Subject<MouseEvent>();
  lastEvent: MouseEvent;
  isReady = false;
  started = false;
  subs: Subscription;
  timeoutClearance: NodeJS.Timeout;

  constructor(containerId: string, targetWindow: Window = top) {
    this.containerId = containerId;
    this.targetWindow = targetWindow;
  }

  init() {
    const containerId = this.containerId;
    const targetWindow = this.targetWindow;
    const finalIdName = `${containerId}-overlay`;
    const existElm = targetWindow.document.getElementById(`#${finalIdName}`);
    let elm = existElm;
    if (!elm) {
      elm = targetWindow.document.createElement('div');
      elm.id = finalIdName;
    }
    elm.setAttribute('style', style);
    this.overlayElm = elm;
    this.targetWindow = targetWindow;
    !existElm && targetWindow.document.body.append(this.overlayElm);
    this.overlayElm.addEventListener('mouseup', this.mouseUpHandler);
    this.overlayElm.addEventListener('mousemove', this.moveHandler);
    this.isReady = true;
  }

  start = () => {
      !this.isReady && this.init();
      this.started = true;
      this.toggleOverlay(true);
  };

  stop = () => {
    if (!this.isReady) return;
    this.subs?.unsubscribe();
    this.clearAllSideEffects();
    this.started = false;
    this.isReady = false;
    this.toggleOverlay(false);
  };

  moveHandler = (event: MouseEvent) => {
    this.movements$.next(event);
    this.lastEvent = event;
  };

  mouseUpHandler = () => {
    this.stop();
    this.moveEnd$.next(this.lastEvent);
    this.lastEvent = undefined;
  };

  clearAllSideEffects = () => {
    this.timeoutClearance && clearTimeout(this.timeoutClearance);
    this.overlayElm.removeEventListener('mousemove', this.moveHandler);
    this.overlayElm.removeEventListener('mouseup', this.mouseUpHandler);
    this.overlayElm.remove();
  };

  toggleOverlay = (force?: boolean) => {
    const isVisible = this._isVisible();
    const finalStatus = force ?? !isVisible;
    this.overlayElm.style.setProperty('display', finalStatus ? 'block' : 'none');
    this.overlayElm.style.setProperty('z-index', finalStatus ? '100000000' : '-100000000');
  };

  _isVisible = () => {
    return this.overlayElm.style.getPropertyValue('display') !== 'none';
  };
}
