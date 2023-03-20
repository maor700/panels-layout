import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import { PalEditInPlaceCustomEvent } from '../../components';
import { Panel } from '../../services/panelsConfig';

@Component({
  tag: 'pal-panel-stack-header',
  styleUrl: 'pal-panel-stack-header.css',
})
export class PalPanelStackHeader {
  @Prop() panelTitle: string;
  @Prop() active: boolean = false;
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @Prop() logicContainer: string;
  @Prop() treeId: string;
  @Prop() showSettingsBtn: boolean;
  @Prop() editablePanelName: boolean = true;

  @State() iAmDragging = false;
  @State() titleEditable = false;

  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrag: EventEmitter<DragStage>;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabClose: EventEmitter<string>;
  @Event({ bubbles: true, composed: true, cancelable: true }) changePanelDisplayMode: EventEmitter<DisplayModeChange>;
  @Event({ bubbles: true, composed: true, cancelable: true }) showSettings: EventEmitter<boolean>;
  @Event({ bubbles: true, composed: true, cancelable: true }) setPanelTitle: EventEmitter<PanelTitlePayload>;

  @Element() elm: HTMLElement;

  titleElm: HTMLSpanElement;
  public titleMutatatioObserver: MutationObserver;

  moveHandler = _ => {
    this.tabDrag.emit({ treeId: this.treeId, panelId: this.panelId, logicContainer: this.logicContainer });
    this.iAmDragging = true;
  };

  upHandler = () => {
    this.tabDrag.emit(null);
    this.iAmDragging = false;
    top.document.removeEventListener('mousemove', this.moveHandler);
    top.document.removeEventListener('mouseup', this.upHandler);
  };
  textSubmitHandler = ({ detail: newTitle }: PalEditInPlaceCustomEvent<string>) => {
    this.setPanelTitle.emit({ panelId: this.panelId, title: newTitle });
  };

  render() {
    return (
      <Host
        class={`${this.iAmDragging ? 'i-am-dragging' : ''}`}
        onMouseDown={_ => {
          top.document.addEventListener('mousemove', this.moveHandler);
          top.document.addEventListener('mouseup', this.upHandler);
        }}
      >
        <div class={`${this.active ? 'active' : ''} stack-head`}>
          <pal-ui5-icon
            hoverStyle
            onClick={() => {
              this.changePanelDisplayMode.emit({ panelId: this.panelId, treeId: this.treeId, displayMode: 'close' });
            }}
            class="close stack-head-btn"
            lib="sap"
            icon="decline"
            title="סגור"
          />
          <div class="name" title="גרור כדי למקם מחדש">
            <pal-edit-in-place disableEdit={!this.editablePanelName} onTextSubmit={this.textSubmitHandler} textValue={this.panelTitle} />
          </div>
          {this.panelData?.settings?.displayModes && (
            <pal-panel-header-menu showSettingsBtn={this.showSettingsBtn} displayModes={this.panelData?.settings?.displayModes} panelId={this.panelId} treeId={this.treeId} />
          )}
        </div>
      </Host>
    );
  }
}
