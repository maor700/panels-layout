/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Panel, PanelTypes } from "./services/panelsConfig";
export namespace Components {
    interface AppRoot {
    }
    interface PalContentPanel {
        "index": number;
        "logicContainer": string;
        "panelData": Panel;
        "panelId": string;
    }
    interface PalDivider {
        "flexDirection": string;
        "sibiling"?: string[];
    }
    interface PalDragDropContext {
    }
    interface PalDragDropSnap {
        "direction": string | TabDropDirections;
        "logicContainer": string;
        "panelId": string;
        "treeId": string;
    }
    interface PalFlexContainerPanel {
        "flexDirection": PanelTypes.column | PanelTypes.row;
        "panelData": Panel;
        "panels": Panel[];
    }
    interface PalFloatPanel {
        "index": number;
        "panelData": Panel;
        "panelId": string;
        "panels": Panel[];
    }
    interface PalFloatable {
    }
    interface PalOriginContext {
    }
    interface PalPanel {
        "index": number;
        "logicContainer": string;
        "panelData": Panel;
        "panelId": string;
    }
    interface PalPanelHeaderMenu {
        "panelId": string;
        "panelTitle": string;
        "treeId": string;
    }
    interface PalPanelStackHeader {
        "active": boolean;
        "logicContainer": string;
        "panelId": string;
        "panelTitle": string;
        "treeId": string;
    }
    interface PalResizable {
    }
    interface PalTabsPanel {
        "index": number;
        "panelData": Panel;
        "panelId": string;
        "panels": Panel[];
    }
    interface PalUi5Icon {
        "hoverStyle": boolean;
        "icon": string;
        "lib": 'sap' | 'tnt' | 'suite';
    }
    interface PalWindowPanel {
        "panelId": string;
    }
}
export interface PalDividerCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalDividerElement;
}
export interface PalDragDropContextCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalDragDropContextElement;
}
export interface PalDragDropSnapCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalDragDropSnapElement;
}
export interface PalOriginContextCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalOriginContextElement;
}
export interface PalPanelHeaderMenuCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalPanelHeaderMenuElement;
}
export interface PalPanelStackHeaderCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalPanelStackHeaderElement;
}
export interface PalResizableCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalResizableElement;
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLPalContentPanelElement extends Components.PalContentPanel, HTMLStencilElement {
    }
    var HTMLPalContentPanelElement: {
        prototype: HTMLPalContentPanelElement;
        new (): HTMLPalContentPanelElement;
    };
    interface HTMLPalDividerElement extends Components.PalDivider, HTMLStencilElement {
    }
    var HTMLPalDividerElement: {
        prototype: HTMLPalDividerElement;
        new (): HTMLPalDividerElement;
    };
    interface HTMLPalDragDropContextElement extends Components.PalDragDropContext, HTMLStencilElement {
    }
    var HTMLPalDragDropContextElement: {
        prototype: HTMLPalDragDropContextElement;
        new (): HTMLPalDragDropContextElement;
    };
    interface HTMLPalDragDropSnapElement extends Components.PalDragDropSnap, HTMLStencilElement {
    }
    var HTMLPalDragDropSnapElement: {
        prototype: HTMLPalDragDropSnapElement;
        new (): HTMLPalDragDropSnapElement;
    };
    interface HTMLPalFlexContainerPanelElement extends Components.PalFlexContainerPanel, HTMLStencilElement {
    }
    var HTMLPalFlexContainerPanelElement: {
        prototype: HTMLPalFlexContainerPanelElement;
        new (): HTMLPalFlexContainerPanelElement;
    };
    interface HTMLPalFloatPanelElement extends Components.PalFloatPanel, HTMLStencilElement {
    }
    var HTMLPalFloatPanelElement: {
        prototype: HTMLPalFloatPanelElement;
        new (): HTMLPalFloatPanelElement;
    };
    interface HTMLPalFloatableElement extends Components.PalFloatable, HTMLStencilElement {
    }
    var HTMLPalFloatableElement: {
        prototype: HTMLPalFloatableElement;
        new (): HTMLPalFloatableElement;
    };
    interface HTMLPalOriginContextElement extends Components.PalOriginContext, HTMLStencilElement {
    }
    var HTMLPalOriginContextElement: {
        prototype: HTMLPalOriginContextElement;
        new (): HTMLPalOriginContextElement;
    };
    interface HTMLPalPanelElement extends Components.PalPanel, HTMLStencilElement {
    }
    var HTMLPalPanelElement: {
        prototype: HTMLPalPanelElement;
        new (): HTMLPalPanelElement;
    };
    interface HTMLPalPanelHeaderMenuElement extends Components.PalPanelHeaderMenu, HTMLStencilElement {
    }
    var HTMLPalPanelHeaderMenuElement: {
        prototype: HTMLPalPanelHeaderMenuElement;
        new (): HTMLPalPanelHeaderMenuElement;
    };
    interface HTMLPalPanelStackHeaderElement extends Components.PalPanelStackHeader, HTMLStencilElement {
    }
    var HTMLPalPanelStackHeaderElement: {
        prototype: HTMLPalPanelStackHeaderElement;
        new (): HTMLPalPanelStackHeaderElement;
    };
    interface HTMLPalResizableElement extends Components.PalResizable, HTMLStencilElement {
    }
    var HTMLPalResizableElement: {
        prototype: HTMLPalResizableElement;
        new (): HTMLPalResizableElement;
    };
    interface HTMLPalTabsPanelElement extends Components.PalTabsPanel, HTMLStencilElement {
    }
    var HTMLPalTabsPanelElement: {
        prototype: HTMLPalTabsPanelElement;
        new (): HTMLPalTabsPanelElement;
    };
    interface HTMLPalUi5IconElement extends Components.PalUi5Icon, HTMLStencilElement {
    }
    var HTMLPalUi5IconElement: {
        prototype: HTMLPalUi5IconElement;
        new (): HTMLPalUi5IconElement;
    };
    interface HTMLPalWindowPanelElement extends Components.PalWindowPanel, HTMLStencilElement {
    }
    var HTMLPalWindowPanelElement: {
        prototype: HTMLPalWindowPanelElement;
        new (): HTMLPalWindowPanelElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "pal-content-panel": HTMLPalContentPanelElement;
        "pal-divider": HTMLPalDividerElement;
        "pal-drag-drop-context": HTMLPalDragDropContextElement;
        "pal-drag-drop-snap": HTMLPalDragDropSnapElement;
        "pal-flex-container-panel": HTMLPalFlexContainerPanelElement;
        "pal-float-panel": HTMLPalFloatPanelElement;
        "pal-floatable": HTMLPalFloatableElement;
        "pal-origin-context": HTMLPalOriginContextElement;
        "pal-panel": HTMLPalPanelElement;
        "pal-panel-header-menu": HTMLPalPanelHeaderMenuElement;
        "pal-panel-stack-header": HTMLPalPanelStackHeaderElement;
        "pal-resizable": HTMLPalResizableElement;
        "pal-tabs-panel": HTMLPalTabsPanelElement;
        "pal-ui5-icon": HTMLPalUi5IconElement;
        "pal-window-panel": HTMLPalWindowPanelElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface PalContentPanel {
        "index"?: number;
        "logicContainer"?: string;
        "panelData"?: Panel;
        "panelId"?: string;
    }
    interface PalDivider {
        "flexDirection"?: string;
        "onDividerMove"?: (event: PalDividerCustomEvent<{ sibiling; movementX; movementY }>) => void;
        "sibiling"?: string[];
    }
    interface PalDragDropContext {
        "onChangePanelDisplayMode"?: (event: PalDragDropContextCustomEvent<DisplayModeChange>) => void;
        "onRequestOverlay"?: (event: PalDragDropContextCustomEvent<boolean>) => void;
        "onTabClose"?: (event: PalDragDropContextCustomEvent<string>) => void;
        "onTabDroped"?: (event: PalDragDropContextCustomEvent<DragProccess>) => void;
    }
    interface PalDragDropSnap {
        "direction"?: string | TabDropDirections;
        "logicContainer"?: string;
        "onTabDrop"?: (event: PalDragDropSnapCustomEvent<DragStage>) => void;
        "panelId"?: string;
        "treeId"?: string;
    }
    interface PalFlexContainerPanel {
        "flexDirection"?: PanelTypes.column | PanelTypes.row;
        "panelData"?: Panel;
        "panels"?: Panel[];
    }
    interface PalFloatPanel {
        "index"?: number;
        "panelData"?: Panel;
        "panelId"?: string;
        "panels"?: Panel[];
    }
    interface PalFloatable {
    }
    interface PalOriginContext {
        "onChangePanelDisplayMode"?: (event: PalOriginContextCustomEvent<DisplayModeChange>) => void;
        "onTabClose"?: (event: PalOriginContextCustomEvent<string>) => void;
        "onTabDroped"?: (event: PalOriginContextCustomEvent<DragProccess>) => void;
    }
    interface PalPanel {
        "index"?: number;
        "logicContainer"?: string;
        "panelData"?: Panel;
        "panelId"?: string;
    }
    interface PalPanelHeaderMenu {
        "onChangePanelDisplayMode"?: (event: PalPanelHeaderMenuCustomEvent<DisplayModeChange>) => void;
        "panelId"?: string;
        "panelTitle"?: string;
        "treeId"?: string;
    }
    interface PalPanelStackHeader {
        "active"?: boolean;
        "logicContainer"?: string;
        "onChangePanelDisplayMode"?: (event: PalPanelStackHeaderCustomEvent<DisplayModeChange>) => void;
        "onTabClose"?: (event: PalPanelStackHeaderCustomEvent<string>) => void;
        "onTabDrag"?: (event: PalPanelStackHeaderCustomEvent<DragStage>) => void;
        "panelId"?: string;
        "panelTitle"?: string;
        "treeId"?: string;
    }
    interface PalResizable {
        "onRequestOverlay"?: (event: PalResizableCustomEvent<{status:boolean, clearance?:()=>void}>) => void;
    }
    interface PalTabsPanel {
        "index"?: number;
        "panelData"?: Panel;
        "panelId"?: string;
        "panels"?: Panel[];
    }
    interface PalUi5Icon {
        "hoverStyle"?: boolean;
        "icon"?: string;
        "lib"?: 'sap' | 'tnt' | 'suite';
    }
    interface PalWindowPanel {
        "panelId"?: string;
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "pal-content-panel": PalContentPanel;
        "pal-divider": PalDivider;
        "pal-drag-drop-context": PalDragDropContext;
        "pal-drag-drop-snap": PalDragDropSnap;
        "pal-flex-container-panel": PalFlexContainerPanel;
        "pal-float-panel": PalFloatPanel;
        "pal-floatable": PalFloatable;
        "pal-origin-context": PalOriginContext;
        "pal-panel": PalPanel;
        "pal-panel-header-menu": PalPanelHeaderMenu;
        "pal-panel-stack-header": PalPanelStackHeader;
        "pal-resizable": PalResizable;
        "pal-tabs-panel": PalTabsPanel;
        "pal-ui5-icon": PalUi5Icon;
        "pal-window-panel": PalWindowPanel;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "pal-content-panel": LocalJSX.PalContentPanel & JSXBase.HTMLAttributes<HTMLPalContentPanelElement>;
            "pal-divider": LocalJSX.PalDivider & JSXBase.HTMLAttributes<HTMLPalDividerElement>;
            "pal-drag-drop-context": LocalJSX.PalDragDropContext & JSXBase.HTMLAttributes<HTMLPalDragDropContextElement>;
            "pal-drag-drop-snap": LocalJSX.PalDragDropSnap & JSXBase.HTMLAttributes<HTMLPalDragDropSnapElement>;
            "pal-flex-container-panel": LocalJSX.PalFlexContainerPanel & JSXBase.HTMLAttributes<HTMLPalFlexContainerPanelElement>;
            "pal-float-panel": LocalJSX.PalFloatPanel & JSXBase.HTMLAttributes<HTMLPalFloatPanelElement>;
            "pal-floatable": LocalJSX.PalFloatable & JSXBase.HTMLAttributes<HTMLPalFloatableElement>;
            "pal-origin-context": LocalJSX.PalOriginContext & JSXBase.HTMLAttributes<HTMLPalOriginContextElement>;
            "pal-panel": LocalJSX.PalPanel & JSXBase.HTMLAttributes<HTMLPalPanelElement>;
            "pal-panel-header-menu": LocalJSX.PalPanelHeaderMenu & JSXBase.HTMLAttributes<HTMLPalPanelHeaderMenuElement>;
            "pal-panel-stack-header": LocalJSX.PalPanelStackHeader & JSXBase.HTMLAttributes<HTMLPalPanelStackHeaderElement>;
            "pal-resizable": LocalJSX.PalResizable & JSXBase.HTMLAttributes<HTMLPalResizableElement>;
            "pal-tabs-panel": LocalJSX.PalTabsPanel & JSXBase.HTMLAttributes<HTMLPalTabsPanelElement>;
            "pal-ui5-icon": LocalJSX.PalUi5Icon & JSXBase.HTMLAttributes<HTMLPalUi5IconElement>;
            "pal-window-panel": LocalJSX.PalWindowPanel & JSXBase.HTMLAttributes<HTMLPalWindowPanelElement>;
        }
    }
}
