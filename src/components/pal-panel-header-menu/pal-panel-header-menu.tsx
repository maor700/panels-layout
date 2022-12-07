import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'pal-panel-header-menu',
  styleUrl: 'pal-panel-header-menu.css',
})
export class PalPanelHeaderMenu {
  @Prop() panelTitle: string;
  @Prop() panelId: string;
  @Prop() treeId: string;
  @State() showMenu = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) changePanelDisplayMode: EventEmitter<DisplayModeChange>;

  menuToggle = (_: MouseEvent) => {
    this.showMenu = !this.showMenu;
  };

  changeDisplayMode = (displayMode: DisplayModes) => {
    this.changePanelDisplayMode.emit({ panelId: this.panelId, treeId: this.treeId, displayMode });
  };

  render() {
    return (
      <Host>
        {this.panelId && this.treeId ? (
          <div>
            <pal-ui5-icon onClick={this.menuToggle} icon="menu2" lib="sap" title="תפריט פעולות" hoverStyle class="stack-head-btn" />
            <div class="menu-con">
              {this.showMenu && (
                <ul class="menu">
                  <div onClick={() => this.changeDisplayMode('minimize')} class="menu-item option">
                    <pal-ui5-icon icon="minimize" lib="sap" title="מזער" class="stack-head-btn" />
                    מזער
                  </div>
                  {/* <div class="menu-item option">
                    <pal-ui5-icon onClick={() => this.changeDisplayMode('maximize')} icon="border" lib="sap" title="הגדל" class="stack-head-btn" />
                    הגדל
                  </div> */}
                  <div onClick={() => this.changeDisplayMode('dettach')} class="menu-item option">
                    <pal-ui5-icon icon="dimension" lib="sap" title="נתק" class="stack-head-btn" />
                    נתק
                  </div>
                  <div onClick={() => this.changeDisplayMode('window')} class="menu-item option">
                    <pal-ui5-icon icon="header" lib="sap" title="חלון" class="stack-head-btn" />
                    חלון
                  </div>
                  <div onClick={() => this.changeDisplayMode('close')} class="menu-item option">
                    <pal-ui5-icon icon="decline" lib="sap" title="סגור" class="stack-head-btn" />
                    סגור
                  </div>
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Host>
    );
  }
}
