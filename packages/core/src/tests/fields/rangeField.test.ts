import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseRangeFieldTestOptions, RANGE_FIELD_ID, DEFAULT_NUMBER_VALUE } from './../test.options';
import * as utils from '../../utils';
import { RangeField } from '../../fields';
import { FIELD_TYPE_RANGE } from '../../constants';

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

describe('range-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseRangeFieldTestOptions,
        },
      ],
    });

    const field = form.getField(RANGE_FIELD_ID)! as unknown as RangeField;
    field.updateInputPadding();
    expect(field.getValue()).toBe(DEFAULT_NUMBER_VALUE);
    expect(field.getId()).toBe(RANGE_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), RANGE_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_RANGE);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseRangeFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(RANGE_FIELD_ID)! as unknown as RangeField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input uses validate function and detects min and max', () => {
    const form = createForm({
      schema: [
        {
          ...baseRangeFieldTestOptions,
          required: true,
          min: 1,
          default: 0,
        },
      ],
    });
    const field = form.getField(RANGE_FIELD_ID)! as unknown as RangeField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();

    field.setValue(10);
    field.validate();
    expect(field.getValidity()).toBeTruthy();

    field.setValue(101);
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input passes validation with valid number', () => {
    const form = createForm({
      schema: [
        {
          ...baseRangeFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(RANGE_FIELD_ID)! as unknown as RangeField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
    field.setValue(DEFAULT_NUMBER_VALUE);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });

  it('resets correctly', () => {
    const form = createForm({
      schema: [
        {
          ...baseRangeFieldTestOptions,
          default: DEFAULT_NUMBER_VALUE,
        },
      ],
    });
    const field = form.getField(RANGE_FIELD_ID)! as unknown as RangeField;

    field.setValue(10);
    expect(field.getValue()).toBe(10);
    field.reset();
    expect(field.getValue()).toBe(DEFAULT_NUMBER_VALUE);

    field.setValue(10);
    expect(field.getValue()).toBe(10);
    field.options.default = undefined;
    field.reset();
    expect(field.getValue()).toBe(null);
  });

  it('input triggers change event', () => {
    const form = createForm({
      schema: [
        {
          ...baseRangeFieldTestOptions,
          default: null,
        },
      ],
    });
    const field = form.getField(RANGE_FIELD_ID)! as unknown as RangeField;
    const element = document.querySelector('#' + field.getId());
    expect(element).not.toBeNull();
    const event = new Event('change');
    element!.dispatchEvent(event);
    expect(field.getValue()).toBeNull();
  });
});
