import { Component, Host, h, Prop, Element } from '@stencil/core';
import { Panel } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';
import '@deckdeckgo/drag-resize-rotate';
import { debounce } from 'lodash';

@Component({
  tag: 'pal-float-panel',
  styleUrl: 'pal-float-panel.css',
})
export class PalFloatPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @Prop() index: number;
  @Prop() panels: Panel[] = [];
  @Element() elm: HTMLElement;
  max: {};
  intersectObserver: IntersectionObserver;

  componentWillLoad() {
    this.intersectObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const { intersectionRect, boundingClientRect, intersectionRatio, target, isIntersecting } = entry;
          // console.log({ intersectionRect, boundingClientRect, intersectionRatio, isIntersecting });
          const floatPanel = target as HTMLPalFloatableElement;
          if (!isIntersecting) {
            floatPanel.pauseDrag = true;
            const delta = { top: intersectionRect.bottom - boundingClientRect.bottom, left: intersectionRect.right - boundingClientRect.right };
            const { topFactor, leftFactor } = { topFactor: delta.top < 0 ? -1 : delta.top === 0 ? 0 : 1, leftFactor: delta.left < 0 ? -1 : delta.left === 0 ? 0 : 1 };

            // console.log({ topFactor, leftFactor });

            const dimentions = {
              top: topFactor ? floatPanel.offsetTop + (delta.top + 10 * topFactor) : undefined,
              left: leftFactor ? floatPanel.offsetLeft + (delta.left + 10 * leftFactor) : undefined,
            };
            
            if(dimentions.top === undefined) delete dimentions.top;
            if(dimentions.left === undefined) delete dimentions.left;
            // console.log({ delta });

            const ev = new CustomEvent('submitTransform', {
              detail: { panelId: floatPanel?.panelId, transform: dimentions },
              bubbles: true,
              cancelable: true,
              composed: true,
            });
            // (entry.target as HTMLElement).dispatchEvent(ev);
            this.debouncedTransformSubmit(target, ev);
          } else {
            // floatPanel.pauseDrag = false;
          }
        });
      },
      { root: this.elm, threshold: 1, rootMargin: '-1px' },
    );
  }

  componentDidLoad() {
    this.max = { maxWith: this.elm.offsetWidth, maxHeight: this.elm.offsetHeight };
  }

  debouncedTransformSubmit = debounce((target, ev) => (target as HTMLElement).dispatchEvent(ev), 200);

  setActive(panel: Panel) {
    treesDB.treesItems.update(this.panelId, { activeTab: panel?.id });
  }

  render() {
    const activeTab =
      this.panels?.find(({ id }) => {
        return this.panelData?.activeTab === id;
      }) ?? this.panels?.[0];
    const { offsetHeight, offsetWidth } = this.elm;
    const area: PanelPosition = { left: offsetWidth, top: offsetHeight };
    return (
      <Host style={{ ...this.max }} class={`panel ${this.panelData.type} `}>
        <div class="grid-stick-layout">
          <div class="main">
            <div class={`content ${this.panelData.type}`}>
              {this.panels?.map((p, i) => (
                <div style={{ position: 'realative' }}>
                  <pal-floatable intersectObserver={this.intersectObserver} maxArea={area} panelId={p.id} position={p?.transform}>
                    <pal-panel-stack-header
                      slot="draggable-header"
                      logicContainer={this.panelData?.id}
                      panelId={p.id}
                      treeId={p?.treeId}
                      key={p.id}
                      panelTitle={p.name}
                      title={p.name}
                      active={p.id === activeTab.id}
                      onClick={() => this.setActive(p)}
                    />
                    <pal-resizable panelId={p.id} dimensions={p?.transform} style={{ display: 'block' }} slot="content">
                      <pal-panel style={{ width: '40%', height: '60%' }} logicContainer={this.panelData?.id} index={i} panelData={p} panelId={p.id} key={p.id}></pal-panel>
                    </pal-resizable>
                  </pal-floatable>
                </div>
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
