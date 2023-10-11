import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { PanelSettings } from '../../services/panelsConfig';

@Component({
  tag: 'pal-panel-header-menu',
  styleUrl: 'pal-panel-header-menu.css',
  scoped:true
})
export class PalPanelHeaderMenu {
  @Prop() panelTitle: string;
  @Prop() panelId: string;
  @Prop() treeId: string;
  @Prop() showSettingsBtn: boolean = true;
  @Prop() displayModes: PanelSettings['displayModes'];
  @State() showMenu = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) changePanelDisplayMode_internal: EventEmitter<DisplayModeChange>;
  @Event({ bubbles: true, composed: true, cancelable: true }) showSettings: EventEmitter<boolean>;

  menuToggle = () => {
    this.showMenu = !this.showMenu;
  };

  changeDisplayMode = (displayMode: DisplayModes) => {
    this.changePanelDisplayMode_internal.emit({ panelId: this.panelId, treeId: this.treeId, displayMode });
  };
  showSettingsHandler = () => {
    this.showSettings.emit(true);
    this.menuToggle();
  };

  render() {
    return (
      <Host>
        {this.panelId && this.displayModes && this.treeId ? (
          <div>
            <pal-ui5-icon onClick={this.menuToggle} icon="menu2" lib="sap" title="תפריט פעולות" hoverStyle class="stack-head-btn" />
            <div class="menu-con">
              {this.showMenu && (
                <ul class="menu">
                  {this.displayModes?.['minimized'] && (
                    <div onClick={() => this.changeDisplayMode('minimize')} class="menu-item option">
                      <pal-ui5-icon icon="minimize" lib="sap" title="מזער" class="stack-head-btn" />
                      מזער
                    </div>
                  )}
                  {/* <div class="menu-item option">
                    <pal-ui5-icon onClick={() => this.changeDisplayMode('maximize')} icon="border" lib="sap" title="הגדל" class="stack-head-btn" />
                    הגדל
                  </div> */}
                  {this.displayModes?.['dettached'] &&<div onClick={() => this.changeDisplayMode('dettach')} class="menu-item option">
                    <pal-ui5-icon icon="dimension" lib="sap" title="נתק" class="stack-head-btn" />
                    נתק
                  </div>}
                  {this.displayModes?.['newWindow'] &&<div onClick={() => this.changeDisplayMode('window')} class="menu-item option">
                    <pal-ui5-icon icon="header" lib="sap" title="חלון" class="stack-head-btn" />
                    חלון
                  </div>}
                  <div onClick={() => this.changeDisplayMode('close')} class="menu-item option">
                    <pal-ui5-icon icon="decline" lib="sap" title="סגור" class="stack-head-btn" />
                    סגור
                  </div>
                  {this.showSettingsBtn && <div onClick={this.showSettingsHandler} class="menu-item option">
                    <pal-ui5-icon icon="action-settings" lib="sap" title="הגדרות" class="stack-head-btn" />
                    הגדרות
                  </div>}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Host>
    );
  }
}
