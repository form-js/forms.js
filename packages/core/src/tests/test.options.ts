import { Form, FormOptions, Field, GroupOptions } from '../index';

export const DEFAULT_STRING_VALUE = 'foo';
export const DEFAULT_STRING_VALUE_SECOND = 'bar';
export const DEFAULT_NUMBER_VALUE = 0;
export const DEFAULT_BOOL_VALUE = true;
export const DEFAULT_COLOR_VALUE = '#000000';
export const DEFAULT_DATE_VALUE = '2024-01-01';
export const DEFAULT_DATETIME_VALUE = '2024-01-01T01:01';
export const DEFAULT_EMAIL_VALUE = 'test@test.com';
export const DEFAULT_FILE_VALUE = null;
export const DEFAULT_PHONE_VALUE = '+123456789012345';
export const INVALID_PHONE_VALUE = '12345';
export const FORM_ID = 'test-form';
export const TEST_LICENSE = 'CC-Attribution-NonCommercial-NoDerivatives';
export const INVALID_EMAIL_VALUE = 'invalid';
export const FILE_ACCEPT_VALUE = '.doc';

export const TEXT_FIELD_ID = 'test-text-field';
export const CHECKBOX_FIELD_ID = 'test-checkbox-field';
export const COLOR_FIELD_ID = 'test-color-field';
export const DATE_FIELD_ID = 'test-date-field';
export const EMAIL_FIELD_ID = 'test-email-field';
export const FILE_FIELD_ID = 'test-file-field';
export const HIDDEN_FIELD_ID = 'test-hidden-field';
export const NUMBER_FIELD_ID = 'test-number-field';
export const PASSWORD_FIELD_ID = 'test-password-field';
export const TELEPHONE_FIELD_ID = 'test-telephone-field';
export const BUTTON_ID = 'test-button';
export const GROUP_ID = 'test-group';

export const VALIDATION_ERROR = 'validation_error';

export const validationFail = () => false;

export const baseFormOptions: FormOptions = {
  id: FORM_ID,
  schema: [],
};

export const baseTextFieldTestOptions = {
  id: TEXT_FIELD_ID,
  name: 'test-field-name',
  label: 'Testing Field',
  type: 'text',
  default: DEFAULT_STRING_VALUE,
  className: 'text-field-class',
};

export const baseCheckboxFieldTestOptions = {
  id: CHECKBOX_FIELD_ID,
  name: 'test-checkbox',
  label: 'Testing Field',
  type: 'checkbox',
  default: DEFAULT_BOOL_VALUE,
  className: 'checkbox-field-class',
};

export const baseColorFieldTestOptions = {
  id: COLOR_FIELD_ID,
  name: 'test-color',
  label: 'Testing Field',
  type: 'color',
  default: DEFAULT_COLOR_VALUE,
  className: 'color-field-class',
};

export const baseDateFieldTestOptions = {
  id: DATE_FIELD_ID,
  name: 'test-date',
  label: 'Testing Field',
  type: 'date',
  default: DEFAULT_DATE_VALUE,
  className: 'date-field-class',
  placeholder: 'date-placeholder',
  enhance: false,
};

export const baseDatetimeFieldTestOptions = {
  id: DATE_FIELD_ID,
  name: 'test-date',
  label: 'Testing Field',
  type: 'datetime',
  default: DEFAULT_DATETIME_VALUE,
  className: 'date-field-class',
  placeholder: 'date-placeholder',
  enhance: false,
};

export const baseEmailFieldTestOptions = {
  id: EMAIL_FIELD_ID,
  name: 'test-email',
  label: 'Testing Field',
  type: 'email',
  default: DEFAULT_EMAIL_VALUE,
  className: 'email-field-class',
  placeholder: 'email-placeholder',
};

export const baseFileFieldTestOptions = {
  id: FILE_FIELD_ID,
  name: 'test-file',
  label: 'Testing Field',
  type: 'file',
  default: DEFAULT_FILE_VALUE,
  className: 'file-field-class',
  placeholder: 'file-placeholder',
  enhance: false,
};

export const baseHiddenFieldTestOptions = {
  id: HIDDEN_FIELD_ID,
  name: 'test-hidden',
  label: 'Testing Field',
  type: 'hidden',
  default: DEFAULT_STRING_VALUE,
};

export const baseNumberFieldTestOptions = {
  id: NUMBER_FIELD_ID,
  name: 'test-number',
  label: 'Testing Field',
  type: 'number',
  default: DEFAULT_NUMBER_VALUE,
  className: 'number-field-class',
  placeholder: 'number-placeholder',
  step: 1
};

export const basePasswordFieldTestOptions = {
  id: PASSWORD_FIELD_ID,
  name: 'test-password',
  label: 'Testing Field',
  type: 'password',
  default: DEFAULT_STRING_VALUE,
  className: 'password-field-class',
  placeholder: 'password-placeholder',
};

export const baseTelephoneFieldTestOptions = {
  id: TELEPHONE_FIELD_ID,
  name: 'test-telephone',
  label: 'Testing Field',
  type: 'tel',
  default: DEFAULT_PHONE_VALUE,
  className: 'telephone-field-class',
  placeholder: 'tel-placeholder',
};

export const baseGroupTestOptions = {
  id: GROUP_ID,
  type: 'group',
};

export const baseButtonTestOptions = {
  id: BUTTON_ID,
  type: 'button',
  template: 'btn',
};

export function createForm(opt?: Record<string, any>) {
  const parent = document.createElement('div');
  document.body.append(parent);
  parent.className = FORM_ID;
  parent.id = FORM_ID;
  const options: FormOptions = {
    ...baseFormOptions,
    schema: [baseTextFieldTestOptions],
    ...opt,
  };
  const form = new Form(parent, options);
  return form;
}
