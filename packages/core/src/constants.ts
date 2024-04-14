import { FormElementType, pluginConstructor } from './types';
import { useLicensedFetures } from './utils';

export const PACKAGE_LICENSE_URL = 'https://formsjs.io/documentation/v1/licensing';

export const licensePlateClass = '#';
export const licensePlateStyle =
  'position: fixed !important; font-weight: bold; font-size: .8rem;  bottom: 1rem !important;  left: 1rem !important;  background: #fff;  border: 2px solid red;  padding: .5rem;  border-radius: 0.15rem;  z-index: 99999 !important;  display: inline-flex !important;  align-items: center;  color: red;  text-decoration: none;  transition: 0.2s linear;';

export const STRING_CONDITION_SPLIT = ';';
export const STRING_CONDITION_VALUE_SPLIT = ':';
export const STRING_CONDITION_DATE_IDENTIFIER = 'date!';

export const FORM_CLASS_DEFAULT = 'formsjs-form';
export const BUTTON_CONTAINER_CLASS_DEFAULT = 'form-button-container';
export const GROUP_CONTAINER_CLASS_DEFAULT = 'form-group-container';
export const GROUP_CLASS_DEFAULT = 'form-group';
export const GROUP_LABEL_CLASS_DEFAULT = 'form-group-label';
export const BUTTON_CLASS_DEFAULT = 'btn form-button';
export const INPUT_CLASS_DEFAULT = 'form-input';
export const FIELD_CONTAINER_CLASS_DEFAULT = 'form-field-container';
export const FIELD_CLASS_DEFAULT = 'form-field';
export const LABEL_CLASS_DEFAULT = 'form-field-label';
export const VALIDATION_CLASS_DEFAULT = 'form-field-validation';
export const FORM_ERROR_CLASS_DEFAULT = 'form-error';
export const FIELD_DISABLED_CLASS_DEFAULT = 'field-disabled';
export const FIELD_REQUIRED_CLASS_DEFAULT = 'field-required';
export const CHECKBOX_CLASS_DEFAULT = 'form-input-checkbox';
export const TOGGLE_CLASS_DEFAULT = 'is-toggle';
export const TOGGLE_SLIDER_CLASS_DEFAULT = 'toggle-slider';
export const COLOR_CLASS_DEFAULT = 'form-input-color';
export const RADIO_CLASS_DEFAULT = 'form-input-radio';
export const RANGE_CLASS_DEFAULT = 'form-input-range';
export const RANGE_MIN_CLASS_DEFAULT = 'form-input-range-min';
export const RANGE_MAX_CLASS_DEFAULT = 'form-input-range-max';
export const RANGE_VALUE_CLASS_DEFAULT = 'form-input-range-value';
export const SELECT_CLASS_DEFAULT = 'form-input-select';
export const STATIC_CLASS_DEFAULT = 'form-input-static';

export const DEFAULT_REQUIRED_VALIDATION_MESSAGE = 'This field is required';
export const INVALID_EMAIL_VALIDATION_MESSAGE = 'Not a valid email address';
export const INVALID_PHONE_VALIDATION_MESSAGE = 'Not a valid telephone number';
export const INVALID_URL_VALIDATION_MESSAGE = 'Not a valid url address';
export const BIGGER_THAN_VALIDATION_MESSAGE = 'The value should be bigger than ';
export const LESS_THAN_VALIDATION_MESSAGE = 'The value should be less than ';

export const DIV_ELEMENT = 'div';
export const SPAN_ELEMENT = 'span';
export const LABEL_ELEMENT = 'label';
export const FORM_ELEMENT = 'form';
export const LINK_ELEMENT = 'a';
export const BUTTON_ELEMENT = 'button';
export const INPUT_ELEMENT = 'input';
export const PARAGRAPH_ELEMENT = 'p';
export const H3_ELEMENT = 'h3';
export const OUTPUT_ELEMENT = 'output';
export const SELECT_ELEMENT = 'select';
export const OPTION_ELEMENT = 'option';
export const TEXTAREA_ELEMENT = 'textarea';

export const CONTAINER_DEFINITION = '_container';
export const LABEL_DEFINITION = '_label';
export const VALIDATION_DEFINITION = '_validation';
export const GROUP_CONTAINER_DEFINITION = '_group_container';
export const FORMSJS_KEY_DEFINITION = '__formsjs_';
export const FIELD_KEY_DEFINITION = '_field_';
export const MIN_DEFINITION = '_min';
export const MAX_DEFINITION = '_max';
export const VALUE_DEFINITION = '_value';

export const ID_ATTRIBUTE = 'id';
export const ACTION_ATTRIBUTE = 'action';
export const METHOD_ATTRIBUTE = 'method';
export const SUBMIT_ATTRIBUTE = 'submit';
export const RESET_ATTRIBUTE = 'reset';
export const TYPE_ATTRIBUTE = 'type';
export const HREF_ATTRIBUTE = 'href';
export const CLICK_ATTRIBUTE = 'click';
export const INPUT_ATTRIBUTE = 'input';
export const NAME_ATTRIBUTE = 'name';
export const PLACEHOLDER_ATTRIBUTE = 'placeholder';
export const FOR_ATTRIBUTE = 'for';
export const ARIA_INVALID_ATTRIBUTE = 'aria-invalid';
export const ARIA_DESCRIBEDBY_ATTRIBUTE = 'aria-describedby';
export const DISABLED_ATTRIBUTE = 'disabled';
export const REQUIRED_ATTRIBUTE = 'required';
export const CHECKED_ATTRIBUTE = 'checked';
export const CHANGE_ATTRIBUTE = 'change';
export const MULTIPLE_ATTRIBUTE = 'multiple';
export const ACCEPT_ATTRIBUTE = 'accept';
export const MIN_ATTRIBUTE = 'min';
export const MAX_ATTRIBUTE = 'max';
export const STEP_ATTRIBUTE = 'step';
export const VALUE_ATTRIBUTE = 'value';
export const SELECTED_ATTRIBUTE = 'selected';
export const ROWS_ATTRIBUTE = 'rows';

export const GROUP_TYPE_GROUP = 'group';
export const BUTTON_TYPE_BUTTON = 'button';
export const FIELD_TYPE_CHECKBOX = 'checkbox';
export const FIELD_TYPE_COLOR = 'color';
export const FIELD_TYPE_DATE = 'date';
export const FIELD_TYPE_DATETIME = 'datetime';
export const FIELD_TYPE_EMAIL = 'email';
export const FIELD_TYPE_FILE = 'file';
export const FIELD_TYPE_HIDDEN = 'hidden';
export const FIELD_TYPE_NUMBER = 'number';
export const FIELD_TYPE_PASSWORD = 'password';
export const FIELD_TYPE_RADIO = 'radio';
export const FIELD_TYPE_RANGE = 'range';
export const FIELD_TYPE_SELECT = 'select';
export const FIELD_TYPE_STATIC = 'static';
export const FIELD_TYPE_TEL = 'tel';
export const FIELD_TYPE_TEXTAREA = 'textarea';
export const FIELD_TYPE_TEXT = 'text';
export const FIELD_TYPE_TIME = 'time';
export const FIELD_TYPE_URL = 'url';
export const FIELD_TYPE_WEEK = 'week';
export const FIELD_TYPE_DATERANGE = 'daterange';

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
export const constructorTypes = {
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
export const RELEASE_DATE = '2024-04-14';

/* Register new constructor */
export const registerConstructor = (
  type: string,
  constructor: pluginConstructor,
  constructorT: string,
  licensed: boolean = false,
) => {
  switch (constructorT) {
    case constructorTypes.button:
      buttons.push(type);
      break;
    case constructorTypes.group:
      groups.push(type);
      break;
    case constructorTypes.field:
      fields.push(type);
      break;
  }

  if (licensed) useLicensedFetures();

  elementConstructors[type] = constructor;
};
