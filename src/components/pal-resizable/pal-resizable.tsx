import { Component, h, Host, Element } from '@stencil/core';
import interact from 'interactjs';

@Component({
  tag: 'pal-resizable',
  shadow: true,
})
export class PalResizable {
  @Element() el: HTMLElement;
  draggableElm: HTMLElement;
  componentDidLoad() {
    const direction = getComputedStyle(this.el).direction;
    const edges = direction === 'ltr' ? { top: false, left: false, bottom: true, right: true } : { top: false, left: true, bottom: true, right: false };
    interact(this.el).resizable({
      edges,
      // listeners: {
      //   move: function (event) {
      //     let { x, y } = event.target.dataset;

      //     x = (parseFloat(x) || 0) + event.deltaRect.left;
      //     y = (parseFloat(y) || 0) + event.deltaRect.top;

      //     Object.assign(event.target.style, {
      //       width: `${event.rect.width}px`,
      //       height: `${event.rect.height}px`,
      //       transform: `translate(${x}px, ${y}px)`,
      //     });

      //     Object.assign(event.target.dataset, { x, y });
      //   },
      // },
    });
  }
  render() {
    return (
      <Host class={'resizable'}>
        <slot />
      </Host>
    );
  }
}
