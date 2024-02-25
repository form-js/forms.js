import { FormElementType, pluginConstructor } from './types';
import { useLicensedFetures } from './utils';

export const PACKAGE_LICENSE_URL = 'https://formsjs.io/documentation/v1/licensing';

export const licensePlateClass = '#';
export const licensePlateStyle =
  'position: fixed !important; font-weight: bold; font-size: .8rem;  bottom: 1rem !important;  left: 1rem !important;  background: #fff;  border: 2px solid red;  padding: .5rem;  border-radius: 0.15rem;  z-index: 99999 !important;  display: inline-flex !important;  align-items: center;  color: red;  text-decoration: none;  transition: 0.2s linear;';

export const STRING_CONDITION_SPLIT = ';';
export const STRING_CONDITION_VALUE_SPLIT = ':';
export const STRING_CONDITION_DATE_IDENTIFIER = 'date!';

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

export const VALID_LICENSE_TEXT = 'forms.js license key is valid';
export const INVALID_LICENSE_TEXT = 'forms.js license key is invalid';
export const OUTDATED_LICENSE_TEXT = 'forms.js license key is outdated';
export const INVALID_CONSOLE_TEXT = 'forms.js license key is invalid, please use a valid license key.';
export const OUTDATED_CONSOLE_TEXT = 'forms.js license key is outdated, please update your license key.';

export const UPGRADE_WINDOW = 365 + 7;

export const LICENSE_STATE = {
  VALID: 1,
  OUTDATED: 2,
  INVALID: 3,
};

/**
 * Release date.
 */
export const RELEASE_DATE = '2024-02-25';

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
