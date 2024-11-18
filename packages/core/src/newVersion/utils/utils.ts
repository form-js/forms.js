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

/**
 * Converts a plain JavaScript object to a FormData instance.
 * This is useful for sending objects as form data via XHR or Fetch.
 */
export const objectToFormData = (obj: any, form?: FormData, namespace?: string): FormData => {
  const fd = form || new FormData();
  let formKey: string | null;

  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      if (obj[property] == null) {
        fd.append(formKey, '');
      } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        objectToFormData(obj[property], fd, property);
      } else {
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
};
