/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Panel, PanelSettings as PanelSettings1, PanelTypes } from "./services/panelsConfig";
import { Panel as Panel1, PanelSettings } from "./components";
export { Panel, PanelSettings as PanelSettings1, PanelTypes } from "./services/panelsConfig";
export { Panel as Panel1, PanelSettings } from "./components";
export namespace Components {
    interface AppRoot {
    }
    interface PalContentPanel {
        "forceHiddenHeader": boolean;
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
    interface PalEditInPlace {
        "disableEdit": boolean;
        "textValue": string;
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
        "disableMove": boolean;
        "intresectionObserver": IntersectionObserver;
        "panelId": string;
        "position": PanelPosition;
        "settings": PanelSettings1;
    }
    interface PalLayoutTree {
        "collapseTo"?: 'right' | 'left' | 'top' | 'bottom';
        "isOpened"?: boolean;
        "treeId": string;
        "treesDb": InstanceType<typeof TreesDB<Panel>>;
    }
    interface PalLayoutTreeMinimized {
        "panels": Panel1[];
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
        "displayModes": PanelSettings1['displayModes'];
        "panelId": string;
        "panelTitle": string;
        "showSettingsBtn": boolean;
        "treeId": string;
    }
    interface PalPanelSettings {
        "panelId": string;
        "settings": PanelSettings1;
    }
    interface PalPanelStackHeader {
        "active": boolean;
        "editablePanelName": boolean;
        "logicContainer": string;
        "panelData": Panel;
        "panelId": string;
        "panelTitle": string;
        "showSettingsBtn": boolean;
        "treeId": string;
    }
    interface PalResizable {
        "dimensions": Partial<PanelDimensions>;
        "disabledResize": boolean;
        "panelId": string;
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
export interface PalEditInPlaceCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalEditInPlaceElement;
}
export interface PalFloatPanelCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalFloatPanelElement;
}
export interface PalFloatableCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalFloatableElement;
}
export interface PalLayoutTreeMinimizedCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalLayoutTreeMinimizedElement;
}
export interface PalOriginContextCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalOriginContextElement;
}
export interface PalPanelHeaderMenuCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalPanelHeaderMenuElement;
}
export interface PalPanelSettingsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPalPanelSettingsElement;
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
    interface HTMLPalEditInPlaceElement extends Components.PalEditInPlace, HTMLStencilElement {
    }
    var HTMLPalEditInPlaceElement: {
        prototype: HTMLPalEditInPlaceElement;
        new (): HTMLPalEditInPlaceElement;
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
    interface HTMLPalLayoutTreeElement extends Components.PalLayoutTree, HTMLStencilElement {
    }
    var HTMLPalLayoutTreeElement: {
        prototype: HTMLPalLayoutTreeElement;
        new (): HTMLPalLayoutTreeElement;
    };
    interface HTMLPalLayoutTreeMinimizedElement extends Components.PalLayoutTreeMinimized, HTMLStencilElement {
    }
    var HTMLPalLayoutTreeMinimizedElement: {
        prototype: HTMLPalLayoutTreeMinimizedElement;
        new (): HTMLPalLayoutTreeMinimizedElement;
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
    interface HTMLPalPanelSettingsElement extends Components.PalPanelSettings, HTMLStencilElement {
    }
    var HTMLPalPanelSettingsElement: {
        prototype: HTMLPalPanelSettingsElement;
        new (): HTMLPalPanelSettingsElement;
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
        "pal-edit-in-place": HTMLPalEditInPlaceElement;
        "pal-flex-container-panel": HTMLPalFlexContainerPanelElement;
        "pal-float-panel": HTMLPalFloatPanelElement;
        "pal-floatable": HTMLPalFloatableElement;
        "pal-layout-tree": HTMLPalLayoutTreeElement;
        "pal-layout-tree-minimized": HTMLPalLayoutTreeMinimizedElement;
        "pal-origin-context": HTMLPalOriginContextElement;
        "pal-panel": HTMLPalPanelElement;
        "pal-panel-header-menu": HTMLPalPanelHeaderMenuElement;
        "pal-panel-settings": HTMLPalPanelSettingsElement;
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
        "forceHiddenHeader"?: boolean;
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
        "onSetPanelTitle"?: (event: PalDragDropContextCustomEvent<PanelTitlePayload>) => void;
        "onSubmitSettings"?: (event: PalDragDropContextCustomEvent<{ panelId: string; settings: Partial<PanelSettings> }>) => void;
        "onSubmitTransform"?: (event: PalDragDropContextCustomEvent<{ panelId: string; transform: Partial<PanelTransform> }>) => void;
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
    interface PalEditInPlace {
        "disableEdit"?: boolean;
        "onTextChange"?: (event: PalEditInPlaceCustomEvent<string>) => void;
        "onTextSubmit"?: (event: PalEditInPlaceCustomEvent<string>) => void;
        "textValue"?: string;
    }
    interface PalFlexContainerPanel {
        "flexDirection"?: PanelTypes.column | PanelTypes.row;
        "panelData"?: Panel;
        "panels"?: Panel[];
    }
    interface PalFloatPanel {
        "index"?: number;
        "onSubmitTransform"?: (event: PalFloatPanelCustomEvent<TransformEvent>) => void;
        "panelData"?: Panel;
        "panelId"?: string;
        "panels"?: Panel[];
    }
    interface PalFloatable {
        "disableMove"?: boolean;
        "intresectionObserver"?: IntersectionObserver;
        "onChangePanelDisplayMode_internal"?: (event: PalFloatableCustomEvent<DisplayModeChange>) => void;
        "onRequestOverlay"?: (event: PalFloatableCustomEvent<{ status: boolean; clearance?: () => void }>) => void;
        "onShowSettings"?: (event: PalFloatableCustomEvent<boolean>) => void;
        "onSubmitTransform"?: (event: PalFloatableCustomEvent<{ panelId: string; transform: Partial<PanelTransform> }>) => void;
        "panelId"?: string;
        "position"?: PanelPosition;
        "settings"?: PanelSettings1;
    }
    interface PalLayoutTree {
        "collapseTo"?: 'right' | 'left' | 'top' | 'bottom';
        "isOpened"?: boolean;
        "treeId"?: string;
        "treesDb"?: InstanceType<typeof TreesDB<Panel>>;
    }
    interface PalLayoutTreeMinimized {
        "onMinimizedClick"?: (event: PalLayoutTreeMinimizedCustomEvent<Panel1>) => void;
        "panels"?: Panel1[];
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
        "displayModes"?: PanelSettings1['displayModes'];
        "onChangePanelDisplayMode_internal"?: (event: PalPanelHeaderMenuCustomEvent<DisplayModeChange>) => void;
        "onShowSettings"?: (event: PalPanelHeaderMenuCustomEvent<boolean>) => void;
        "panelId"?: string;
        "panelTitle"?: string;
        "showSettingsBtn"?: boolean;
        "treeId"?: string;
    }
    interface PalPanelSettings {
        "onShowSettings"?: (event: PalPanelSettingsCustomEvent<boolean>) => void;
        "onSubmitSettings"?: (event: PalPanelSettingsCustomEvent<{ panelId: string; settings: Partial<PanelSettings1> }>) => void;
        "panelId"?: string;
        "settings"?: PanelSettings1;
    }
    interface PalPanelStackHeader {
        "active"?: boolean;
        "editablePanelName"?: boolean;
        "logicContainer"?: string;
        "onChangePanelDisplayMode_internal"?: (event: PalPanelStackHeaderCustomEvent<DisplayModeChange>) => void;
        "onSetPanelTitle"?: (event: PalPanelStackHeaderCustomEvent<PanelTitlePayload>) => void;
        "onShowSettings"?: (event: PalPanelStackHeaderCustomEvent<boolean>) => void;
        "onTabClose"?: (event: PalPanelStackHeaderCustomEvent<string>) => void;
        "onTabDrag"?: (event: PalPanelStackHeaderCustomEvent<DragStage>) => void;
        "panelData"?: Panel;
        "panelId"?: string;
        "panelTitle"?: string;
        "showSettingsBtn"?: boolean;
        "treeId"?: string;
    }
    interface PalResizable {
        "dimensions"?: Partial<PanelDimensions>;
        "disabledResize"?: boolean;
        "onRequestOverlay"?: (event: PalResizableCustomEvent<{ status: boolean; clearance?: () => void }>) => void;
        "onSubmitTransform"?: (event: PalResizableCustomEvent<{ panelId: string; transform: Partial<PanelTransform> }>) => void;
        "panelId"?: string;
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
        "pal-edit-in-place": PalEditInPlace;
        "pal-flex-container-panel": PalFlexContainerPanel;
        "pal-float-panel": PalFloatPanel;
        "pal-floatable": PalFloatable;
        "pal-layout-tree": PalLayoutTree;
        "pal-layout-tree-minimized": PalLayoutTreeMinimized;
        "pal-origin-context": PalOriginContext;
        "pal-panel": PalPanel;
        "pal-panel-header-menu": PalPanelHeaderMenu;
        "pal-panel-settings": PalPanelSettings;
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
            "pal-edit-in-place": LocalJSX.PalEditInPlace & JSXBase.HTMLAttributes<HTMLPalEditInPlaceElement>;
            "pal-flex-container-panel": LocalJSX.PalFlexContainerPanel & JSXBase.HTMLAttributes<HTMLPalFlexContainerPanelElement>;
            "pal-float-panel": LocalJSX.PalFloatPanel & JSXBase.HTMLAttributes<HTMLPalFloatPanelElement>;
            "pal-floatable": LocalJSX.PalFloatable & JSXBase.HTMLAttributes<HTMLPalFloatableElement>;
            "pal-layout-tree": LocalJSX.PalLayoutTree & JSXBase.HTMLAttributes<HTMLPalLayoutTreeElement>;
            "pal-layout-tree-minimized": LocalJSX.PalLayoutTreeMinimized & JSXBase.HTMLAttributes<HTMLPalLayoutTreeMinimizedElement>;
            "pal-origin-context": LocalJSX.PalOriginContext & JSXBase.HTMLAttributes<HTMLPalOriginContextElement>;
            "pal-panel": LocalJSX.PalPanel & JSXBase.HTMLAttributes<HTMLPalPanelElement>;
            "pal-panel-header-menu": LocalJSX.PalPanelHeaderMenu & JSXBase.HTMLAttributes<HTMLPalPanelHeaderMenuElement>;
            "pal-panel-settings": LocalJSX.PalPanelSettings & JSXBase.HTMLAttributes<HTMLPalPanelSettingsElement>;
            "pal-panel-stack-header": LocalJSX.PalPanelStackHeader & JSXBase.HTMLAttributes<HTMLPalPanelStackHeaderElement>;
            "pal-resizable": LocalJSX.PalResizable & JSXBase.HTMLAttributes<HTMLPalResizableElement>;
            "pal-tabs-panel": LocalJSX.PalTabsPanel & JSXBase.HTMLAttributes<HTMLPalTabsPanelElement>;
            "pal-ui5-icon": LocalJSX.PalUi5Icon & JSXBase.HTMLAttributes<HTMLPalUi5IconElement>;
            "pal-window-panel": LocalJSX.PalWindowPanel & JSXBase.HTMLAttributes<HTMLPalWindowPanelElement>;
        }
    }
}
