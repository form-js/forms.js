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
export const DEFAULT_URL_VALUE = 'https://www.google.com';
export const INVALID_URL_VALUE = 'test';
export const FORM_ID = 'test-form';
export const TEST_LICENSE = 'CC-Attribution-NonCommercial-NoDerivatives';
export const INVALID_EMAIL_VALUE = 'invalid';
export const FILE_ACCEPT_VALUE = '.doc';
export const DEFAULT_SELECT_VALUE = '1';
export const SECOND_SELECT_VALUE = '2';
export const THIRD_SELECT_VALUE = '3';
export const DEFAULT_TIME_VALUE = '01:01';
export const DEFAULT_WEEK_VALUE = '2024-W1';

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
export const URL_FIELD_ID = 'test-url-field';
export const TEXTAREA_FIELD_ID = 'test-textarea-field';
export const SELECT_FIELD_ID = 'test-select-field';
export const RADIO_FIELD_ID = 'test-radio-field';
export const RADIO_FIELD_ID_OPTION_1 = 'test-radio-field-option-1';
export const RADIO_FIELD_ID_OPTION_2 = 'test-radio-field-option-2';
export const RANGE_FIELD_ID = 'test-range-field';
export const STATIC_FIELD_ID = 'test-static-field';
export const TIME_FIELD_ID = 'test-time-field';
export const WEEK_FIELD_ID = 'test-week-field';
export const BUTTON_ID = 'test-button';
export const GROUP_ID = 'test-group';

export const SELECT_OPTIONS = [
  {
    label: '1',
    value: DEFAULT_SELECT_VALUE,
  },
  {
    label: '1',
    value: SECOND_SELECT_VALUE,
  },
  {
    label: '3',
    value: THIRD_SELECT_VALUE,
    disabled: true,
  },
];

export const DEFAULT_STATIC_VALUE = '<span id="' + STATIC_FIELD_ID + '_template" />';
export const SECOND_STATIC_VALUE = '<span id="' + STATIC_FIELD_ID + '_template_second" />';
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
  step: 1,
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

export const baseUrlFieldTestOptions = {
  id: URL_FIELD_ID,
  name: 'test-url',
  label: 'Testing Field',
  type: 'url',
  default: DEFAULT_URL_VALUE,
  className: 'url-field-class',
  placeholder: 'url-placeholder',
};

export const baseTextareaFieldTestOptions = {
  id: TEXTAREA_FIELD_ID,
  name: 'test-textarea',
  label: 'Testing Field',
  type: 'textarea',
  default: DEFAULT_STRING_VALUE,
  className: 'textarea-field-class',
  placeholder: 'textarea-placeholder',
};

export const baseRadioFieldTestOptions = {
  id: RADIO_FIELD_ID,
  name: 'test-radio',
  label: 'Testing Field',
  type: 'radio',
  default: RADIO_FIELD_ID_OPTION_1,
  className: 'radio-field-class',
  placeholder: 'radio-placeholder',
  schema: [
    {
      id: RADIO_FIELD_ID_OPTION_1,
      label: 'Option 1',
      value: RADIO_FIELD_ID_OPTION_1,
    },
    {
      id: RADIO_FIELD_ID_OPTION_2,
      label: 'Option 1',
      value: RADIO_FIELD_ID_OPTION_2,
    },
  ],
};

export const baseRangeFieldTestOptions = {
  id: RANGE_FIELD_ID,
  name: 'test-range',
  label: 'Testing Field',
  type: 'range',
  default: DEFAULT_NUMBER_VALUE,
  className: 'range-field-class',
  placeholder: 'range-placeholder',
  step: 1,
  min: 0,
  max: 100,
};

export const baseSelectFieldTestOptions = {
  id: SELECT_FIELD_ID,
  name: 'test-select',
  label: 'Testing Field',
  type: 'select',
  default: DEFAULT_SELECT_VALUE,
  className: 'textarea-field-class',
  placeholder: 'textarea-placeholder',
  optionsList: SELECT_OPTIONS,
  enhance: false,
};

export const baseStaticFieldTestOptions = {
  id: STATIC_FIELD_ID,
  name: 'test-static',
  label: 'Testing Field',
  type: 'static',
  template: DEFAULT_STATIC_VALUE,
};

export const baseTimeFieldTestOptions = {
  id: TIME_FIELD_ID,
  name: 'test-time',
  label: 'Testing Field',
  type: 'time',
  default: DEFAULT_TIME_VALUE,
  className: 'time-field-class',
  placeholder: 'time-placeholder',
  enhance: false,
};

export const baseWeekFieldTestOptions = {
  id: WEEK_FIELD_ID,
  name: 'test-week',
  label: 'Testing Field',
  type: 'week',
  default: DEFAULT_WEEK_VALUE,
  className: 'week-field-class',
  placeholder: 'week-placeholder',
  enhance: false,
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
