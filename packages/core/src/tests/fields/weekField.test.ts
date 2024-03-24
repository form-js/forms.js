import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseWeekFieldTestOptions, WEEK_FIELD_ID, DEFAULT_WEEK_VALUE } from './../test.options';
import * as utils from '../../utils';
import { WeekField } from '../../fields';
import { FIELD_TYPE_WEEK } from '../../constants';

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
          ...baseWeekFieldTestOptions,
        },
      ],
    });

    const field = form.getField(WEEK_FIELD_ID)! as unknown as WeekField;
    expect(field.getValue()).toBe(DEFAULT_WEEK_VALUE);
    expect(field.getId()).toBe(WEEK_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), WEEK_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_WEEK);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
    expect(field.getFlatpickr()).toBeNull();
  });

  it('input triggers change event', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseWeekFieldTestOptions,
          default: false,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(WEEK_FIELD_ID)! as unknown as WeekField;
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
          ...baseWeekFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(WEEK_FIELD_ID)! as unknown as WeekField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('gets flatpickr when enhanced', () => {
    const form = createForm({
      schema: [
        {
          ...baseWeekFieldTestOptions,
          enhance: true,
        },
      ],
    });
    const field = form.getField(WEEK_FIELD_ID)! as unknown as WeekField;
    expect(field.getFlatpickr()).not.toBeNull();
  });
});
