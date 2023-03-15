import { Component, Host, h, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { Panel } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';
import '@deckdeckgo/drag-resize-rotate';
import { debounce } from 'lodash';

type TransformEvent = { panelId: string; transform: Partial<PanelTransform> };

@Component({
  tag: 'pal-float-panel',
  styleUrl: 'pal-float-panel.css',
})
export class PalFloatPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @Prop() index: number;
  @Prop() panels: Panel[] = [];
  @Event({ bubbles: true, composed: true, cancelable: true }) submitTransform: EventEmitter<TransformEvent>;
  @Element() elm: HTMLElement;
  public resizeObsr: ResizeObserver;
  public floatedPanelCon: HTMLDivElement;
  public zIndexCounter = 1;

  componentDidLoad() {
    this.zIndexCounter += this.panels.length;
    this.resizeObsr = new ResizeObserver(entries => {
      entries.forEach(({ contentRect }) => {
        const { width, height } = contentRect;
        this.debouncedTransformSubmit({ panelId: this.panelId, transform: { ...this.panelData?.transform, width, height } });
      });
    });
    this.resizeObsr.observe(this.elm);
  }

  discodisconnectedCallback() {
    this.resizeObsr?.disconnect();
  }

  debouncedTransformSubmit = debounce((transformEvent: TransformEvent) => this.submitTransform.emit(transformEvent), 200);

  setActive(panel: Panel, elm?: HTMLElement) {
    treesDB.treesItems.update(this.panelId, { activeTab: panel?.id });
    elm && this.bringToFront(elm);
  }

  bringToFront(elm: HTMLElement) {
    this.zIndexCounter += 1;
    elm.style.setProperty('z-index', this.zIndexCounter + '');
  }

  render() {
    const activeTab =
      this.panels?.find(({ id }) => {
        return this.panelData?.activeTab === id;
      }) ?? this.panels?.[0];
    return (
      <Host class={`panel ${this.panelData.type} `}>
        <div class="grid-stick-layout">
          <div class="main">
            <div
              ref={el => {
                this.floatedPanelCon = el;
              }}
              class={`content ${this.panelData.type}`}
            >
              {this.panels?.map((p, i) => (
                <pal-floatable
                  onMouseDown={({ currentTarget }) => {
                    this.setActive(p, currentTarget as HTMLElement);
                  }}
                  panelId={p.id}
                  position={p?.transform}
                  settings={p?.settings}
                  style={{ zIndex: '1' }}
                  disableMove={!p?.settings?.transform.move}
                >
                  <pal-panel-stack-header
                    panelData={p}
                    slot="draggable-header"
                    logicContainer={this.panelData?.id}
                    panelId={p.id}
                    treeId={p?.treeId}
                    key={p.id}
                    panelTitle={p.name}
                    title={p.name}
                    active={p.id === activeTab.id}
                  />
                  {
                    <pal-resizable disabledResize={!p?.settings?.transform.resize} panelId={p.id} dimensions={p?.transform} style={{ display: 'block' }} slot="content">
                      <pal-panel logicContainer={this.panelData?.id} index={i} panelData={p} panelId={p.id} key={p.id}></pal-panel>
                    </pal-resizable>
                  }
                </pal-floatable>
              ))}
            </div>
          </div>
          {/* <div class="footer panels-container-header">
            {this.panels.map(p => {
              return (
                <pal-panel-stack-header
                  logicContainer={this.panelData?.id}
                  panelId={p.id}
                  treeId={p?.treeId}
                  key={p.id}
                  panelTitle={p.name}
                  title={p.name}
                  active={p.id === activeTab.id}
                  onClick={() => this.setActive(p)}
                ></pal-panel-stack-header>
              );
            })}
          </div> */}
        </div>
      </Host>
    );
  }
}
