import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseTextareaFieldTestOptions, TEXTAREA_FIELD_ID, DEFAULT_STRING_VALUE } from './../test.options';
import * as utils from '../../utils';
import { TextareaField } from '../../fields';
import { FIELD_TYPE_TEXTAREA } from '../../constants';

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

describe('textarea-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextareaFieldTestOptions,
        },
      ],
    });

    const field = form.getField(TEXTAREA_FIELD_ID)! as unknown as TextareaField;
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
    expect(field.getId()).toBe(TEXTAREA_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), TEXTAREA_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_TEXTAREA);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextareaFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(TEXTAREA_FIELD_ID)! as unknown as TextareaField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input passes validation with valid string', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextareaFieldTestOptions,
          required: true,
          default: DEFAULT_STRING_VALUE,
        },
      ],
    });
    const field = form.getField(TEXTAREA_FIELD_ID)! as unknown as TextareaField;
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });
});
