import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseDateFieldTestOptions, DATE_FIELD_ID, DEFAULT_DATE_VALUE } from '../test.options';
import * as utils from '../../utils';
import { DateField } from '../../fields';

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

describe('color-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseDateFieldTestOptions,
        },
      ],
    });

    const field = form.getField(DATE_FIELD_ID)! as unknown as DateField;
    expect(field.getValue()).toBe(DEFAULT_DATE_VALUE);
    expect(field.getId()).toBe(DATE_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), DATE_FIELD_ID));
    expect(field.getType()).toBe('date');
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
    expect(field.getFlatpickr()).not.toBeDefined();
  });

  it('input triggers change event', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseDateFieldTestOptions,
          default: false,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(DATE_FIELD_ID)! as unknown as DateField;
    const element = form.getFormElement()!.querySelector('#' + field.getId());
    expect(element).not.toBeNull();
    const event = new Event('change');
    element!.dispatchEvent(event);
    expect(mockChange).toHaveBeenCalled();
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseDateFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(DATE_FIELD_ID)! as unknown as DateField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('gets flatpickr when enhanced', () => {
    const form = createForm({
      schema: [
        {
          ...baseDateFieldTestOptions,
          enhance: true,
        },
      ],
    });
    const field = form.getField(DATE_FIELD_ID)! as unknown as DateField;
    expect(field.getFlatpickr()).toBeDefined();
  });
});
