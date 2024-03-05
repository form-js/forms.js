import { baseTextFieldTestOptions } from './../test.options';
import { TextField } from './../../fields/textField';
import { describe, expect, it } from '@jest/globals';
import { createForm, DEFAULT_STRING_VALUE, TEXT_FIELD_ID } from '../test.options';
import { generateFieldSaveKey } from '../../utils';
import { Field } from '../../field';

describe('text-field', () => {
  it('core field class gets field value', () => {
    const form = createForm();
    const field = new Field(form.getFormElement()!, form, baseTextFieldTestOptions);
    field.setValue(DEFAULT_STRING_VALUE);
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
  });

  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          conditions: 'test',
          disabled: 'test',
          required: 'test',
          validation: 'test',
          placeholder: 'test',
          default: undefined,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    expect(field.getValue()).toBe(null);
    expect(field.getId()).toBe(TEXT_FIELD_ID);
    expect(field.getSaveKey()).toBe(generateFieldSaveKey(form.getId(), TEXT_FIELD_ID));
    expect(field.getType()).toBe('text');
    expect(field.getVisibility()).toBeFalsy();
    expect(field.getValidity()).toBe(null);
    expect(field.isDisabled()).toBeFalsy();
    expect(field.getValidationMessage()).toBe(null);
    expect(field.getForm()).toBe(form);
  });
});
