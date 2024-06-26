import { describe, expect, it, jest } from '@jest/globals';
import { createForm, basePasswordFieldTestOptions, PASSWORD_FIELD_ID, DEFAULT_STRING_VALUE } from './../test.options';
import * as utils from '../../utils';
import { PasswordField } from '../../fields';
import { FIELD_TYPE_PASSWORD } from '../../constants';

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
    expect(field.getType()).toBe(FIELD_TYPE_PASSWORD);
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

  it('creates show/hide password button', () => {
    const form = createForm({
      schema: [
        {
          ...basePasswordFieldTestOptions,
          allowPeek: true,
        },
      ],
    });
    const field = form.getField(PASSWORD_FIELD_ID)! as unknown as PasswordField;
    const input = field.inputElement as HTMLInputElement;
    const button = field.containerElement!.querySelector('button.pass-hidden') as HTMLButtonElement;

    expect(input).toBeTruthy();
    expect(button).toBeTruthy();
    expect(input.type).toBe('password');
    expect(button.ariaLabel).toBe('show password');
    button.click();
    expect(input.type).toBe('text');
    expect(button.ariaLabel).toBe('hide password');
    expect(button.classList.contains('pass-shown')).toBeTruthy();
    expect(button.classList.contains('pass-hidden')).toBeFalsy();
    button.click();
    expect(input.type).toBe('password');
    expect(button.ariaLabel).toBe('show password');
    expect(button.classList.contains('pass-hidden')).toBeTruthy();
    expect(button.classList.contains('pass-shown')).toBeFalsy();
  });

  it('does not create show/hide password button by default', () => {
    const form = createForm({
      schema: [basePasswordFieldTestOptions],
    });

    const field = form.getField(PASSWORD_FIELD_ID)! as unknown as PasswordField;
    const button = field.containerElement!.querySelector('button.pass-hidden');

    expect(button).toBeFalsy();
  });
});
