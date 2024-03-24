import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseTimeFieldTestOptions, TIME_FIELD_ID, DEFAULT_TIME_VALUE } from './../test.options';
import * as utils from '../../utils';
import { TimeField } from '../../fields';
import { FIELD_TYPE_TIME } from '../../constants';

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

describe('time-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseTimeFieldTestOptions,
        },
      ],
    });

    const field = form.getField(TIME_FIELD_ID)! as unknown as TimeField;
    expect(field.getValue()).toBe(DEFAULT_TIME_VALUE);
    expect(field.getId()).toBe(TIME_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), TIME_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_TIME);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
    expect(field.getFlatpickr()).toBeNull();
  });

  it('input triggers change event', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseTimeFieldTestOptions,
          default: false,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(TIME_FIELD_ID)! as unknown as TimeField;
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
          ...baseTimeFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(TIME_FIELD_ID)! as unknown as TimeField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('gets flatpickr when enhanced', () => {
    const form = createForm({
      schema: [
        {
          ...baseTimeFieldTestOptions,
          enhance: true,
        },
      ],
    });
    const field = form.getField(TIME_FIELD_ID)! as unknown as TimeField;
    expect(field.getFlatpickr()).not.toBeNull();
  });
});
