import {
  LICENSE_STATE,
  OS_LICENSE_KEYS,
  RELEASE_DATE,
  UPGRADE_WINDOW,
  buttons,
  costructorTypes,
  elementConstructors,
  fields,
  groups,
} from './constants';
import { Group } from './group';
import { GroupOptions } from './interfaces';
import { Schema } from './types';

let LICENSE_KEY: string | null = null;
let USES_LICENSED_FETURES: boolean = false;

/**
 * Creates a debounced function that delays invoking the provided callback.
 * @param callback - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @param context - The context to bind for the callback function.
 * @returns - A debounced function.
 */
export const debounce = (callback: (...args: any[]) => void, wait: number, context: any) => {
  let timeoutId: number | null = null;
  return (...args: []) => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(context, args);
    }, wait);
  };
};

/**
 * Appends an HTML element to a parent element.
 * @param element - The element to mount.
 * @param parent - The parent element to append to.
 */
export const mountElement = (element: HTMLElement, parent: HTMLElement): void => {
  parent.append(element);
};

/**
 * Removes an HTML element from its parent.
 * @param element - The element to unmount.
 */
export const unmountElement = (element: HTMLElement): void => {
  element.parentNode?.removeChild(element);
};

/**
 * Converts a plain JavaScript object to a FormData instance.
 * This is useful for sending objects as form data via XHR or Fetch.
 * @param obj - The object to convert.
 * @param form - (Optional) Existing FormData instance to append to.
 * @param namespace - (Optional) Namespace for form keys.
 * @returns - A FormData instance.
 */
export const objectToFormData = (obj: any, form?: FormData, namespace?: string): FormData => {
  const fd = form || new FormData();
  let formKey: string | null;

  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
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

/**
 * Determines if a given type is a field type as per the predefined list.
 * @param type - The type string to check.
 * @returns - True if the type is a field type, false otherwise.
 */
export const isField = (type: string): boolean => {
  return fields.includes(type);
};

/**
 * Determines if a given type is a field type as per the predefined list.
 * @param type - The type string to check.
 * @returns - True if the type is a group type, false otherwise.
 */
export const isGroup = (type: string): boolean => {
  return groups.includes(type);
};

/**
 * Determines if a given type is a field type as per the predefined list.
 * @param type - The type string to check.
 * @returns - True if the type is a button type, false otherwise.
 */
export const isButton = (type: string): boolean => {
  return buttons.includes(type);
};

/**
 * Determines a type of form element.
 * @param type - The type string to check.
 * @returns - type of element from costructorTypes or null if not found.
 */
export const getFormElementType = (type: string): string | null => {
  if (isField(type)) return costructorTypes.field;
  if (isGroup(type)) return costructorTypes.group;
  if (isButton(type)) return costructorTypes.button;
  return null;
};

/**
 * Determines if a given type is a list field type.
 * @param type - The type string to check.
 * @returns - True if the type is a list field type, false otherwise.
 */
export const isListField = (type: string): boolean => {
  return isField(type) && type === 'list';
};

/**
 * Extracts field IDs from the provided schema based on their type.
 *
 * Iterates over each option in the schema. If the option's type is included
 * in the predefined `fields` array, its ID is added to the result list.
 * If an option has its own schema, the function is recursively called to
 * extract fields from the nested schema.
 *
 * @param {Schema} schema - The schema from which fields are to be extracted.
 * @returns {string[]} An array of extracted field IDs.
 */
export const extractFieldsFromSchema = (schema: Schema): string[] => {
  let fieldsList: string[] = [];
  schema.forEach((options: any) => {
    if (fields.includes(options.type)) fieldsList.push(options.id);
    else if (options.schema) fieldsList = [...fields, ...extractFieldsFromSchema(options.schema)];
  });
  return fieldsList;
};

/**
 * Creates a wrapper element to handle the visibility of a field.
 * @param parent - The parent element.
 * @returns The created wrapper element.
 */
export const createWrapper = (parent: HTMLElement): HTMLElement => {
  const wrapper = document.createElement('div');
  mountElement(wrapper, parent);
  return wrapper;
};

/**
 * Transform field name to match list field anotation.
 * @param parentId - id of parent list field.
 * @param key - unique key to define list.
 * @param id - field id.
 */
export const transformFieldName = (parentId: string, key: string, id: string): string => {
  return parentId + '[' + key + ']' + id;
};

/**
 * Transform field name to match list field anotation.
 * @param parentId - id of parent list field.
 * @param key - unique key to define list.
 * @param id - field id.
 */
export const generateFieldSaveKey = (formId: string, id: string): string => {
  return '__formsjs_' + formId + '_field_' + id;
};

const isDateValid = (d: unknown): d is Date => d instanceof Date && !isNaN(d as unknown as number);

const calculateDateAfterAddingDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const parseKey = (key: string) => key.match(/^(\d+)@(\d+)$/);

const isKeyInLicenseKeys = (key: string) => OS_LICENSE_KEYS.includes(key);

const calculateMinPurchaseDate = (releaseDate: Date) => calculateDateAfterAddingDays(releaseDate, -UPGRADE_WINDOW);

const determineLicenseState = (purchaseDate: Date, minPurchaseDate: Date) =>
  minPurchaseDate < purchaseDate ? LICENSE_STATE.VALID : LICENSE_STATE.OUTDATED;

export const processLicenseKey = (): number => {
  const key = LICENSE_KEY;

  if (!key) return LICENSE_STATE.INVALID;

  if (isKeyInLicenseKeys(key)) return LICENSE_STATE.VALID;

  const parts = parseKey(key);
  if (parts?.[1]?.length === 10) {
    const [, , timestamp] = parts;
    const purchaseDate = new Date(parseInt(timestamp, 10) * 1000);
    const releaseDate = new Date(RELEASE_DATE);

    if (isDateValid(releaseDate)) {
      const minPurchaseDate = calculateMinPurchaseDate(releaseDate);
      return determineLicenseState(purchaseDate, minPurchaseDate);
    }
  }

  return LICENSE_STATE.INVALID;
};

export const setLicenseKey = (key: string) => {
  LICENSE_KEY = key;
};

export const getLicenseText = (license: number): string => {
  if (license === LICENSE_STATE.VALID) return 'forms.js license key is valid';
  if (license === LICENSE_STATE.OUTDATED) return 'forms.js license key is outdated';
  return 'forms.js license key is invalid';
};

export const handleInvalidLicenseLog = (license: number): void => {
  console.error('***********************************************');
  if (license === LICENSE_STATE.OUTDATED) {
    console.error('forms.js license key is invalid, please use a valid license key');
  } else {
    console.error('forms.js license key is outdated, please update your license key');
  }
  console.error('***********************************************');
};

export const usesLicensedFetures = (): boolean => {
  return USES_LICENSED_FETURES;
};

export const useLicensedFetures = (): void => {
  USES_LICENSED_FETURES = true;
};
