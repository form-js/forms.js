/**
 * Appends an HTML element to a parent element.
 */
export const mountElement = (element: HTMLElement, parent: HTMLElement): void => {
    parent.append(element);
  };
  
  /**
   * Removes an HTML element from its parent.
   */
  export const unmountElement = (element: HTMLElement): void => {
    element.parentNode?.removeChild(element);
  };