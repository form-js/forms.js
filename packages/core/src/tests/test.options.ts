import { Form, FormOptions, Field } from '../index';

export const DEFAULT_STRING_VALUE = 'foo';
export const DEFAULT_NUMBER_VALUE = 2;
export const DEFAULT_BOOL_VALUE = true;
export const FORM_ID = 'test-form';
export const TEST_LICENSE = 'CC-Attribution-NonCommercial-NoDerivatives';

export const TEXT_FIELD_ID = 'test-text-field';
export const BUTTON_ID = 'test-button';
export const GROUP_ID = 'test-group';

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

export function createForm(opt?: Record<string, any>) {
  const parent = document.createElement('div');
  parent.className = 'test-form';
  const options: FormOptions = {
    ...baseFormOptions,
    schema: [baseTextFieldTestOptions],
    ...opt,
  };
  const form = new Form(parent, options);
  return form;
}
