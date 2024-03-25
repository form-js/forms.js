import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseNumberFieldTestOptions, NUMBER_FIELD_ID, DEFAULT_NUMBER_VALUE } from './../test.options';
import * as utils from '../../utils';
import { NumberField } from '../../fields';
import { FIELD_TYPE_NUMBER } from '../../constants';

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

describe('number-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseNumberFieldTestOptions,
        },
      ],
    });

    const field = form.getField(NUMBER_FIELD_ID)! as unknown as NumberField;
    expect(field.getValue()).toBe(DEFAULT_NUMBER_VALUE);
    expect(field.getId()).toBe(NUMBER_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), NUMBER_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_NUMBER);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseNumberFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(NUMBER_FIELD_ID)! as unknown as NumberField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input uses validate function and detects min and max', () => {
    const form = createForm({
      schema: [
        {
          ...baseNumberFieldTestOptions,
          required: true,
          min: 1,
          max: 2,
        },
      ],
    });
    const field = form.getField(NUMBER_FIELD_ID)! as unknown as NumberField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
    field.setValue(2);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
    field.setValue(3);
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input passes validation with valid number', () => {
    const form = createForm({
      schema: [
        {
          ...baseNumberFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(NUMBER_FIELD_ID)! as unknown as NumberField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
    field.setValue(DEFAULT_NUMBER_VALUE);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });
});
