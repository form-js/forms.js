import {
  DIV_ELEMENT,
  FIELD_KEY_DEFINITION,
  FORMSJS_KEY_DEFINITION,
  INVALID_CONSOLE_TEXT,
  INVALID_LICENSE_TEXT,
  LICENSE_STATE,
  OS_LICENSE_KEYS,
  OUTDATED_CONSOLE_TEXT,
  OUTDATED_LICENSE_TEXT,
  RELEASE_DATE,
  STRING_CONDITION_DATE_IDENTIFIER,
  STRING_CONDITION_SPLIT,
  STRING_CONDITION_VALUE_SPLIT,
  UPGRADE_WINDOW,
  VALID_LICENSE_TEXT,
  buttons,
  constructorTypes,
  fields,
  groups,
} from './constants';
import { FieldOptions } from './interfaces';
import { Schema, FormData, ParsedCondition, Operator, FieldValue } from './types';

let LICENSE_KEY: string | null = null;
let USES_LICENSED_FETURES: boolean = false;

const OVEWRITE_DEFAULT_OPTIONS: Record<string, FieldOptions> = {};

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
 * @returns - type of element from constructorTypes or null if not found.
 */
export const getFormElementType = (type: string): string | null => {
  if (isField(type)) return constructorTypes.field;
  if (isGroup(type)) return constructorTypes.group;
  if (isButton(type)) return constructorTypes.button;
  return null;
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
  schema.forEach((options: Record<string, any>) => {
    if (fields.includes(options.type)) fieldsList.push(options.id);
    else if (options.schema) fieldsList = [...fieldsList, ...extractFieldsFromSchema(options.schema)];
  });
  return fieldsList;
};

/**
 * Creates a wrapper element to handle the visibility of a field.
 * @param parent - The parent element.
 * @returns The created wrapper element.
 */
export const createWrapper = (parent: HTMLElement): HTMLElement => {
  const wrapper = document.createElement(DIV_ELEMENT);
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
  return FORMSJS_KEY_DEFINITION + formId + FIELD_KEY_DEFINITION + id;
};

const isDateValid = (d: unknown): d is Date => d instanceof Date && !isNaN(d as unknown as number);

const calculateDateAfterAddingDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const parseKey = (key: string) => key.match(/^([a-zA-Z]+)@(\d+)$/);

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
  if (license === LICENSE_STATE.VALID) return VALID_LICENSE_TEXT;
  if (license === LICENSE_STATE.OUTDATED) return OUTDATED_LICENSE_TEXT;
  return INVALID_LICENSE_TEXT;
};

export const handleInvalidLicenseLog = (license: number): void => {
  if (license === LICENSE_STATE.INVALID) {
    console.error(INVALID_CONSOLE_TEXT);
  } else {
    console.error(OUTDATED_CONSOLE_TEXT);
  }
};

export const usesLicensedFetures = (): boolean => {
  return USES_LICENSED_FETURES;
};

export const useLicensedFetures = (): void => {
  USES_LICENSED_FETURES = true;
};

/**
 *
 * string conditions evaluation
 */
export const parseConditionString = (conditionStr: string) => {
  return conditionStr
    .split(STRING_CONDITION_SPLIT) // Split by semicolon to separate conditions
    .filter((part) => part.includes(STRING_CONDITION_VALUE_SPLIT)) // Ensure only valid condition:returnValue pairs are processed
    .map((part) => {
      const [rawConditions, returnValue] = part.split(STRING_CONDITION_VALUE_SPLIT); // Split each part into conditions and return value
      const conditions = rawConditions
        // Assuming conditions are wrapped in brackets, remove them before further processing
        .replace(/^\[|\]$/g, '') // Remove leading and trailing brackets
        .split('&&') // Split by AND operator to separate conditions
        .map((andCond) =>
          andCond.split('||').map((orCond) => {
            // Split by OR operator within each AND group
            // Match the condition expression into its components
            const match = orCond.match(/(.*?)(=|!=|>|<|>=|<=)(.*)/);
            if (!match) throw new Error(`Invalid condition format: ${orCond}`);
            const [, left, operator, rightPart] = match;
            let right;
            const isDate = rightPart.trim().startsWith(STRING_CONDITION_DATE_IDENTIFIER);
            if (isDate) {
              // Extract the date string after 'date:' prefix and convert to Date
              right = new Date(rightPart.trim().substring(5));
            } else {
              // Attempt to parse JSON, defaulting to string if it fails
              try {
                right = JSON.parse(rightPart.trim());
              } catch {
                right = rightPart.trim(); // Use as string if not JSON
              }
            }
            // Return the structured condition
            return { left: left.trim(), operator: operator as Operator, right, isDate };
          }),
        );
      // Return the structured condition along with its intended return value
      return { conditions, returnValue };
    });
};

export const evaluateParsedConditions = (
  parsedConditions: ParsedCondition[],
  data: FormData,
  value: FieldValue | null = null,
  required: boolean | null = null,
  def: boolean = false,
): boolean | string => {
  for (const { conditions, returnValue } of parsedConditions) {
    const conditionResult = conditions.every((andConditions) =>
      andConditions.some(({ left, operator, right }) => {
        // inject field value and required int data list
        const dataList = {
          _value: value,
          _required: required,
          ...data,
        };
        const leftValue = getNestedValue(dataList, left);
        return compareValues(operator, leftValue, right);
      }),
    );
    if (conditionResult) {
      try {
        return JSON.parse(returnValue);
      } catch {
        return returnValue as string;
      }
    }
  }
  return def;
};

const getNestedValue = (data: FormData, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], data);
};

export const compareValues = (operator: Operator, a: any, b: any): boolean => {
  switch (operator) {
    case '=':
      return a === b;
    case '!=':
      return a !== b;
    case '>':
      return a > b;
    case '<':
      return a < b;
    case '>=':
      return a >= b;
    case '<=':
      return a <= b;
  }
};

export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const overwriteDefaults = (type: string, defaults: FieldOptions): void => {
  OVEWRITE_DEFAULT_OPTIONS[type] = defaults;
};

export const getOverwritenDefaults = (type: string, defaults: FieldOptions): FieldOptions => {
  if (Object.keys(OVEWRITE_DEFAULT_OPTIONS).includes(type)) {
    return Object.assign({}, defaults, OVEWRITE_DEFAULT_OPTIONS[type]);
  }
  return defaults;
};
