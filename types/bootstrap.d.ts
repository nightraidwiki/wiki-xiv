// Déclaration des types pour Bootstrap
declare module 'bootstrap' {
  export class Modal {
    constructor(element: HTMLElement, options?: any);
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
  }

  export class Dropdown {
    constructor(element: HTMLElement, options?: any);
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
  }

  export class Tab {
    constructor(element: HTMLElement);
    show(): void;
    dispose(): void;
  }

  export class Toast {
    constructor(element: HTMLElement, options?: any);
    show(): void;
    hide(): void;
    dispose(): void;
  }

  export class Tooltip {
    constructor(element: HTMLElement, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
  }

  export class Popover {
    constructor(element: HTMLElement, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
  }

  export class Alert {
    static getInstance(element: HTMLElement): Alert | null;
    close(): void;
    dispose(): void;
  }

  export class Button {
    static getInstance(element: HTMLElement): Button | null;
    toggle(): void;
    dispose(): void;
  }

  export class Carousel {
    constructor(element: HTMLElement, options?: any);
    cycle(): void;
    pause(): void;
    prev(): void;
    next(): void;
    to(index: number): void;
    dispose(): void;
  }

  export class Collapse {
    constructor(element: HTMLElement, options?: any);
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
  }

  export const ModalVERSION: string;
  export const DropdownVERSION: string;
  export const TabVERSION: string;
  export const ToastVERSION: string;
  export const TooltipVERSION: string;
  export const PopoverVERSION: string;
  export const AlertVERSION: string;
  export const ButtonVERSION: string;
  export const CarouselVERSION: string;
  export const CollapseVERSION: string;
}

declare module 'bootstrap/dist/js/bootstrap.bundle.min.js' {
  export * from 'bootstrap';
}

declare module 'bootstrap/dist/css/bootstrap.min.css' {
  const content: string;
  export default content;
}

declare module 'bootstrap-icons/font/bootstrap-icons.css' {
  const content: string;
  export default content;
}
