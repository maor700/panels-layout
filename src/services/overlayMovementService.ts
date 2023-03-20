import { Subject, Subscription } from 'rxjs';

const style = `
position: absolute;
height: 100vh;
width: 100vw;
top: 0;
left: 0;
display:block;
z-index: 100000000;
background:red;
opacity: 0.5;
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

  constructor(containerId: string, targetWindow: Window = top) {
    this.containerId = containerId;
    this.targetWindow = targetWindow;
  }

  init() {
    const containerId = this.containerId;
    const targetWindow = this.targetWindow;
    const finalIdName = `${containerId}-overlay`;
    const existElm = targetWindow.document.getElementById(finalIdName);
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
    if (this.started) return;
    !this.isReady && this.init();
    this.started = true;
  };

  stop = () => {
    if (!this.isReady) return;
    this.subs?.unsubscribe();
    this.clearAllSideEffects();
    this.started = false;
    this.isReady = false;
  };

  moveHandler = (event: MouseEvent) => {
    this.movements$.next(event);
    this.lastEvent = event;
  };

  mouseUpHandler = () => {
    setTimeout(()=>{
      this.stop();
      this.moveEnd$.next(this.lastEvent);
      this.lastEvent = undefined;
    }, 150);
  };

  clearAllSideEffects = () => {
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
