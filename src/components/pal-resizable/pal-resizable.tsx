import { Component, h, Host, Element, State, Event, EventEmitter } from '@stencil/core';

@Component({
  styleUrl: 'pal-resizable.css',
  tag: 'pal-resizable',
  shadow: true,
})
export class PalResizable {
  @Element() el: HTMLElement;
  @State() moving = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) requestOverlay: EventEmitter<{status:boolean, clearance?:()=>void}>;

  componentDidLoad() {
    this.el.addEventListener('mousedown', this.mouseDownHandler);
  }

  mouseDownHandler = _ => {
    this.el.addEventListener('mousemove', this.moveHandler);
    this.el.addEventListener('mouseup', this.upHandler);
  };
  
  upHandler = _ => {
    this.requestOverlay.emit({status:false, clearance:this.clearance});
    this.clearance();
  };

  clearance = ()=>{
    this.el.removeEventListener('mousemove', this.moveHandler);
    this.el.removeEventListener('mouseup', this.upHandler);
  }

  moveHandler = _ => {
    this.requestOverlay.emit({status:true, clearance:this.clearance});
  };

  render() {
    return (
      <Host class="resizable">
        <slot />
      </Host>
    );
  }
}
