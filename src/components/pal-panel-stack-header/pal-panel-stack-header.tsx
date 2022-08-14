import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pal-panel-stack-header',
  styleUrl: 'pal-panel-stack-header.css',
})
export class PalPanelStackHeader {
  @Prop() title: string;
  @Prop() active: boolean = false;
  @Element() elm: HTMLElement;
  @Event() dragTab: EventEmitter<boolean>;
  @State() dragging: boolean = false;
  @Watch('dragging')
  draggingHandlaer(newVal) {
    this.dragTab.emit(newVal);
  }

  componentDidLoad() {
    this.elm.addEventListener('mousedown', () => {
      document.addEventListener('mouseover', this._mouseDownHandler);
      document.addEventListener('mouseup', this._mouseupHandler);
    });
  }
  private _mouseDownHandler = () => {
    if (this.dragging) return;
    this.dragging = true;
  };
  private _mouseupHandler = () => {
    this.dragging = false;
    document.removeEventListener('mouseover', this._mouseDownHandler);
    document.removeEventListener('mouseup', this._mouseupHandler);
  }

  render() {
    return (
      <Host>
        <div class={`${this.active ? 'active' : ''} stack-head`}>
          <div class="close stack-head-btn">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
          </div>
          <div class="name">{this.title}</div>
          <div class="stack-head-btn">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              ></path>
            </svg>
          </div>
        </div>
      </Host>
    );
  }
}
