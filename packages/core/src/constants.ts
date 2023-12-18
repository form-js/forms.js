import { Form } from './form.js';
import { FieldOptions } from './interfaces';
import { FormElementType, pluginConstructor } from './types';
import { useLicensedFetures } from './utils';

export const PACKAGE_LICENSE_URL = '#';

export const licensePlateClass = '#';
export const licensePlateStyle =
  'position: fixed !important; font-weight: bold; font-size: .8rem;  bottom: 1rem !important;  left: 1rem !important;  background: #fff;  border: 2px solid red;  padding: .5rem;  border-radius: 0.15rem;  z-index: 99999 !important;  display: inline-flex !important;  align-items: center;  color: red;  text-decoration: none;  transition: 0.2s linear;';

/**
 * A list of field types used in the application forms.
 */
export const fields: string[] = [];

/**
 * A list of other group-related elements used in the application.
 */
export const groups: string[] = [];

/**
 * A list of other button-related elements used in the application.
 */
export const buttons: string[] = [];

/**
 * A combined list of all form-related elements.
 */
export const formElements: string[] = [];

/**
 * Construcor types, determnine where will be new instances saved
 */
export const costructorTypes = {
  field: 'field',
  group: 'group',
  button: 'button',
};

/**
 * A mapping of form element types to their constructor functions.
 */
export const elementConstructors: {
  [key in FormElementType]?: pluginConstructor;
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
export const registerConstructor = (
  type: string,
  constructor: pluginConstructor,
  constructorT: string,
  licensed: boolean = false,
) => {
  switch (constructorT) {
    case costructorTypes.button:
      buttons.push(type);
      break;
    case costructorTypes.group:
      groups.push(type);
      break;
    case costructorTypes.field:
      fields.push(type);
      break;
  }

  if (licensed) useLicensedFetures();

  elementConstructors[type] = constructor;
};
