import { Form } from './form';
import { FieldOptions } from './interfaces';
import { FormElementType } from './types';

/**
 * A list of field types used in the application forms.
 */
export const fields: string[] = [];

/**
 * A list of other form-related elements used in the application.
 */
export const otherElements: string[] = [];

/**
 * A combined list of all form-related elements.
 */
export const formElements: string[] = [];

/**
 * A mapping of form element types to their constructor functions.
 */
export const elementConstructors: {
  [key in FormElementType]?: new (a: HTMLElement, b: Form, c: FieldOptions) => any;
} = {};

/**
 * License contants.
 */
export const OS_LICENSE_KEYS = ['GPL-My-Project-Is-Open-Source', 'CC-Attribution-NonCommercial-NoDerivatives'];

export const UPGRADE_WINDOW = 365 + 7;

export const LICENSE_STATE = {
  VALID: 1,
  OUTDATED: 2,
  INVALID: 3,
};

/**
 * Release date.
 */
export const RELEASE_DATE = '2023-09-23';

/* Register new constructor */
export const registerConstructor = (type: string, constructor: any, isField: boolean) => {
  if (isField && !fields.includes(type)) fields.push(type);
  else if (!otherElements.includes(type)) otherElements.push(type);
  formElements.push(type);
  elementConstructors[type] = constructor;
};
