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
        "direction": string;
    }
    interface PalFlexContainerPanel {
        "flexDirection": PanelTypes.column | PanelTypes.row;
        "panelId": string;
    }
    interface PalPanel {
        "panelData": Panel;
        "panelId": string;
    }
    interface PalPanelStackHeader {
        "active": boolean;
        "panelId": string;
        "panelTitle": string;
        "treeId": string;
    }
}
export interface PalContentPanelCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalContentPanelElement;
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
export interface PalFlexContainerPanelCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalFlexContainerPanelElement;
}
export interface PalPanelStackHeaderCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalPanelStackHeaderElement;
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
    interface HTMLPalPanelElement extends Components.PalPanel, HTMLStencilElement {
    }
    var HTMLPalPanelElement: {
        prototype: HTMLPalPanelElement;
        new (): HTMLPalPanelElement;
    };
    interface HTMLPalPanelStackHeaderElement extends Components.PalPanelStackHeader, HTMLStencilElement {
    }
    var HTMLPalPanelStackHeaderElement: {
        prototype: HTMLPalPanelStackHeaderElement;
        new (): HTMLPalPanelStackHeaderElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "pal-content-panel": HTMLPalContentPanelElement;
        "pal-divider": HTMLPalDividerElement;
        "pal-drag-drop-context": HTMLPalDragDropContextElement;
        "pal-drag-drop-snap": HTMLPalDragDropSnapElement;
        "pal-flex-container-panel": HTMLPalFlexContainerPanelElement;
        "pal-panel": HTMLPalPanelElement;
        "pal-panel-stack-header": HTMLPalPanelStackHeaderElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface PalContentPanel {
        "onTabDrag"?: (event: PalContentPanelCustomEvent<DragStage>) => void;
        "onTabDrop"?: (event: PalContentPanelCustomEvent<DragStage>) => void;
        "panelData"?: Panel;
        "panelId"?: string;
    }
    interface PalDivider {
        "flexDirection"?: string;
        "onDividerMove"?: (event: PalDividerCustomEvent<{ sibiling; movementX; movementY }>) => void;
        "sibiling"?: string[];
    }
    interface PalDragDropContext {
        "onTabDroped"?: (event: PalDragDropContextCustomEvent<DragProccess>) => void;
    }
    interface PalDragDropSnap {
        "direction"?: string;
        "onSnapDrop"?: (event: PalDragDropSnapCustomEvent<{ direction: string }>) => void;
    }
    interface PalFlexContainerPanel {
        "flexDirection"?: PanelTypes.column | PanelTypes.row;
        "onTabDrag"?: (event: PalFlexContainerPanelCustomEvent<DragStage>) => void;
        "onTabDrop"?: (event: PalFlexContainerPanelCustomEvent<DragStage>) => void;
        "panelId"?: string;
    }
    interface PalPanel {
        "panelData"?: Panel;
        "panelId"?: string;
    }
    interface PalPanelStackHeader {
        "active"?: boolean;
        "onDragTab"?: (event: PalPanelStackHeaderCustomEvent<boolean>) => void;
        "panelId"?: string;
        "panelTitle"?: string;
        "treeId"?: string;
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "pal-content-panel": PalContentPanel;
        "pal-divider": PalDivider;
        "pal-drag-drop-context": PalDragDropContext;
        "pal-drag-drop-snap": PalDragDropSnap;
        "pal-flex-container-panel": PalFlexContainerPanel;
        "pal-panel": PalPanel;
        "pal-panel-stack-header": PalPanelStackHeader;
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
            "pal-panel": LocalJSX.PalPanel & JSXBase.HTMLAttributes<HTMLPalPanelElement>;
            "pal-panel-stack-header": LocalJSX.PalPanelStackHeader & JSXBase.HTMLAttributes<HTMLPalPanelStackHeaderElement>;
        }
    }
}
