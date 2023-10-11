import { Component, Host, h, Prop, State, Watch, Event, EventEmitter, Element, Listen } from '@stencil/core';
import { isObject } from 'lodash';
import { PanelSettings } from '../../services/panelsConfig';

@Component({
  tag: 'pal-panel-settings',
  styleUrl: 'pal-panel-settings.css',
  scoped: true,
})
export class PalPanelSettings {
  @Prop() panelId: string;
  @Prop() settings: PanelSettings;
  @State() tempSettings: PanelSettings;
  @State() showSettingsModal = false;
  @Event() submitSettings: EventEmitter<{ panelId: string; settings: Partial<PanelSettings> }>;
  @Element() elm: HTMLElement;
  @Event({ bubbles: true, composed: true }) showSettings: EventEmitter<boolean>;

  @Listen('showSettings')
  showSettingsHandler(ev: CustomEvent<boolean>) {
    ev.stopPropagation();
    this.showSettingsModal = ev.detail;
  }

  @Watch('settings')
  updateTempSettings(settings) {
    if (!settings) return;
    this.tempSettings = JSON.parse(JSON.stringify(this.settings));
  }

  componentWillLoad() {
    if (!this.settings) return;
    this.tempSettings = JSON.parse(JSON.stringify(this.settings));
  }

  submitHandler = (_: Event) => {
    _.preventDefault();
    const { panelId, tempSettings } = this;
    this.submitSettings.emit({ panelId, settings: tempSettings });
    this.close();
  };

  changeHandler = ({ target }: InputEvent) => {
    const { id, checked } = target as HTMLInputElement;
    const [_, section, prop] = id.split('|');
    this.tempSettings[section][prop] = checked;
    this.tempSettings = { ...this.tempSettings };
  };

  close = () => {
    this.tempSettings = null;
    this.showSettingsModal = false;
  };

  render() {
    // const {transform, flexDrop, displayModes, editableHeaderName, showLock} = this.settings;
    return (
      <Host>
        {this.showSettingsModal && this.settings ? (
          <div class="modal-container">
            <form id="settings" onSubmit={this.submitHandler} style={{ width: '100%', height: '100%' }}>
              <div class="pal-grid-stick-layout">
                <div class="pal-grid-header">
                  <div class="title">Panel Settings</div>
                  <pal-ui5-icon onClick={this.close} icon="decline" lib="sap" title="close" />
                </div>
                {this.tempSettings && (
                  <div class="settings-form pal-grid-main">
                    {Object.entries(this.tempSettings).map(([section, props]) => {
                      if (isObject(props)) {
                        const displaySection = section.replace(/([a-z])([A-Z])/g, '$1 $2');
                        return (
                          <div class="section">
                            <div class="group-title">{displaySection}</div>
                            <div class="field-group">
                              {Object.entries(props).map(([prop, isChecked]: [string, boolean]) => {
                                const id = `${this.panelId}|${section}|${prop}`;
                                const displayProp = prop.replace(/([a-z])([A-Z])/g, '$1 $2');
                                return (
                                  <div class="field">
                                    <input onChange={this.changeHandler} checked={isChecked} id={id} name={id} type="checkbox" />
                                    <label htmlFor={id}>{displayProp}</label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      } else {
                      }
                    })}
                    {/* <div class="section">
                      <div class="group-title">Transform</div>
                      <div class="field-group">
                        <div class="field">
                          <input onChange={this.changeHandler} checked={this.tempSettings.transform.resize} id="transform|resize" name="transform|resize" type="checkbox" />
                          <label htmlFor="transform|resize">Resize</label>
                        </div>
                        <div class="field">
                          <input onChange={this.changeHandler} checked={this.tempSettings.transform.move} id="transform|move" name="transform|move" type="checkbox" />
                          <label htmlFor="transform|move">Move</label>
                        </div>
                      </div>
                    </div>
                    <div class="section">
                      <div class="group-title">Display Modes</div>
                      <div class="field-group">
                        <div class="field">
                          <input onChange={this.changeHandler} checked={this.tempSettings.displayModes.tabs} id="displayModes|tabs" name="displayModes|tabs" type="checkbox" />
                          <label htmlFor="displayModes|tabs">Tabs</label>
                        </div>
                        <div class="field">
                          <input onChange={this.changeHandler} checked={this.tempSettings.displayModes.flex} id="displayModes|flex" name="displayModes|flex" type="checkbox" />
                          <label htmlFor="displayModes|flex">Flex</label>
                        </div>
                        <div class="field">
                          <input
                            onChange={this.changeHandler}
                            checked={this.tempSettings.displayModes.dettached}
                            id="displayModes|dettached"
                            name="displayModes|dettached"
                            type="checkbox"
                          />
                          <label htmlFor="displayModes|dettached">Dettached</label>
                        </div>
                        <div class="field">
                          <input
                            onChange={this.changeHandler}
                            checked={this.tempSettings.displayModes.minimized}
                            id="displayModes|minimized"
                            name="displayModes|minimized"
                            type="checkbox"
                          />
                          <label htmlFor="displayModes|minimized">Minimized</label>
                        </div>
                        <div class="field">
                          <input
                            onChange={this.changeHandler}
                            checked={this.tempSettings.displayModes.newWindow}
                            id="displayModes|newWindow"
                            name="displayModes|newWindow"
                            type="checkbox"
                          />
                          <label htmlFor="displayModes|newWindow">New Window</label>
                        </div>
                      </div>
                    </div>
                    <div class="section">
                      <div class="group-title">Drop Options</div>
                      <div class="field-group">
                        <div class="field">
                          <input onChange={this.changeHandler} id="flexDrop|top" name="flexDrop|top" type="checkbox" />
                          <label htmlFor="flexDrop|top">Top</label>
                        </div>
                        <div class="field">
                          <input onChange={this.changeHandler} id="flexDrop|buttom" name="flexDrop|buttom" type="checkbox" />
                          <label htmlFor="flexDrop|buttom">Buttom</label>
                        </div>
                        <div class="field">
                          <input onChange={this.changeHandler} id="flexDrop|left" name="flexDrop|left" type="checkbox" />
                          <label htmlFor="flexDrop|left">Left</label>
                        </div>
                        <div class="field">
                          <input onChange={this.changeHandler} id="flexDrop|right" name="flexDrop|right" type="checkbox" />
                          <label htmlFor="flexDrop|right">Right</label>
                        </div>
                        <div class="field">
                          <input onChange={this.changeHandler} id="flexDrop|center" name="flexDrop|center" type="checkbox" />
                          <label htmlFor="flexDrop|center">Center</label>
                        </div>
                      </div>
                    </div> */}
                  </div>
                )}
                <div class="pal-grid-footer">
                  <button type="submit" title="Save settings" class="btn primary">
                    Save
                  </button>
                  <button onClick={this.close} title="Cancel and close settings" class="btn ghost">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : null}
        <slot></slot>
      </Host>
    );
  }
}
