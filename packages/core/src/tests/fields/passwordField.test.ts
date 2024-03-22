import { describe, expect, it, jest } from '@jest/globals';
import { createForm, basePasswordFieldTestOptions, PASSWORD_FIELD_ID, DEFAULT_STRING_VALUE } from './../test.options';
import * as utils from '../../utils';
import { PasswordField } from '../../fields';

jest.mock('../../utils', () => {
  const originalModule = jest.requireActual('../../utils') as object;

  return {
    __esModule: true,
    ...originalModule,
    evaluateParsedConditions: jest.fn(),
    parseConditionString: jest.fn(),
    usesLicensedFetures: jest.fn(),
    processLicenseKey: jest.fn(),
  };
});

describe('password-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...basePasswordFieldTestOptions,
        },
      ],
    });

    const field = form.getField(PASSWORD_FIELD_ID)! as unknown as PasswordField;
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
    expect(field.getId()).toBe(PASSWORD_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), PASSWORD_FIELD_ID));
    expect(field.getType()).toBe('password');
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...basePasswordFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(PASSWORD_FIELD_ID)! as unknown as PasswordField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
    field.setValue(DEFAULT_STRING_VALUE);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });
});
