import { Component, Element, h, Host, State } from '@stencil/core';

@Component({
  tag: 'pal-panels-container',
  styleUrl: 'pal-panels-container.css',
})
export class PalPanelsContainer {
  @State() active: string;
  @State() dragMode: boolean;
  @Element() elm: HTMLElement;

  setActive = (panelName: string) => {
    this.active = panelName;
  };

  render() {
    return (
      <Host>
        <div class="grid-stick-layout panels-container">
          <div class="header panels-container-header">
            <pal-panel-stack-header
              onDragTab={({ detail }) => {
                this.dragMode = detail;
              }}
              onClick={() => this.setActive('Projects')}
              active={this.active === 'Projects'}
              title="Projects"
            ></pal-panel-stack-header>
            <pal-panel-stack-header draggable title="Compositions" onClick={() => this.setActive('Compositions')} active={this.active === 'Compositions'}></pal-panel-stack-header>
          </div>
          <div onDrop={console.log} class={`main ${this.dragMode ? 'dragg-mode' : ''}`}>
            <div class="content">
              <slot></slot>
            </div>
            <div class="snaps">
              <div class="trapeze top"></div>
              <div class="trapeze right"></div>
              <div class="trapeze bottom"></div>
              <div class="trapeze left"></div>
              <div class="squar"></div>
            </div>
          </div>
          <div class="footer">Panel Footer</div>
        </div>
      </Host>
    );
  }
}
