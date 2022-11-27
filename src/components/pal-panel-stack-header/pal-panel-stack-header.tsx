import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';

@Component({
  tag: 'pal-panel-stack-header',
  styleUrl: 'pal-panel-stack-header.css',
})
export class PalPanelStackHeader {
  @Prop() panelTitle: string;
  @Prop() active: boolean = false;
  @Prop() panelId: string;
  @Prop() logicContainer: string;
  @Prop() treeId: string;
  @State() showMenu = true;
  @Element() elm: HTMLElement;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrag: EventEmitter<DragStage>;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabClose: EventEmitter<string>;
  @Event({ bubbles: true, composed: true, cancelable: true }) changePanelDisplayMode: EventEmitter<DisplayModeChange>;

  moveHandler = _ => {
    this.tabDrag.emit({ treeId: this.treeId, panelId: this.panelId, logicContainer: this.logicContainer });
  };

  upHandler = () => {
    this.tabDrag.emit(null);
    top.document.removeEventListener('mousemove', this.moveHandler);
    top.document.removeEventListener('mouseup', this.upHandler);
  };

  menuToggle = (_: MouseEvent) => {
    this.showMenu = !this.showMenu;
  };
  changeDisplayMode = (displayMode:DisplayModes) => {
    this.changePanelDisplayMode.emit({panelId:this.panelId, treeId:this.treeId, displayMode})
  };

  render() {
    return (
      <Host
        onMouseDown={_ => {
          _.preventDefault();
          top.document.addEventListener('mousemove', this.moveHandler);
          top.document.addEventListener('mouseup', this.upHandler);
        }}
      >
        <div class={`${this.active ? 'active' : ''} stack-head`}>
          <pal-ui5-icon
            hoverStyle
            onClick={() => {
              this.tabClose.emit(this.panelId);
            }}
            class="close stack-head-btn"
            lib="sap"
            icon="decline"
            title="סגור"
          />
          <div class="name" title="גרור כדי למקם מחדש">
            {this.panelTitle}
          </div>
          <pal-ui5-icon onClick={this.menuToggle} icon="menu2" lib="sap" title="תפריט פעולות" hoverStyle class="stack-head-btn" />
          <div class="menu-con">
            {this.showMenu && (
              <ul class="menu">
                <div onClick={()=>this.changeDisplayMode("minimize")} class="menu-item option">
                  <pal-ui5-icon icon="minimize" lib="sap" title="מזער" class="stack-head-btn" />
                  מזער
                </div>
                <div class="menu-item option">
                  <pal-ui5-icon onClick={this.menuToggle} icon="border" lib="sap" title="הגדל" class="stack-head-btn" />
                  הגדל
                </div>
                <div class="menu-item option">
                  <pal-ui5-icon onClick={this.menuToggle} icon="dimension" lib="sap" title="נתק" class="stack-head-btn" />
                  נתק
                </div>
                <div class="menu-item option">
                  <pal-ui5-icon onClick={this.menuToggle} icon="decline" lib="sap" title="סגור" class="stack-head-btn" />
                  סגור
                </div>
              </ul>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
