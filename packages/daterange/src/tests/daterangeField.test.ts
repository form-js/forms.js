import { baseDateRangeFieldTestOptions, createForm, DEFAULT_VALUE, FIELD_ID } from './testOptions';
import { describe, expect, it, jest } from '@jest/globals';

import { DaterangeField } from '../daterangeField';

describe('daterange-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseDateRangeFieldTestOptions,
        },
      ],
    });

    const field = form.getField(FIELD_ID)! as unknown as DaterangeField;
    expect(field.getValue()).toBe(DEFAULT_VALUE);
    expect(field.getId()).toBe(FIELD_ID);
    expect(field.getType()).toBe('daterange');
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input triggers change event', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseDateRangeFieldTestOptions,
          default: false,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(FIELD_ID)! as unknown as DaterangeField;
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
          ...baseDateRangeFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(FIELD_ID)! as unknown as DaterangeField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('gets flatpickr when enhanced', () => {
    const form = createForm({
      schema: [
        {
          ...baseDateRangeFieldTestOptions,
          enhance: true,
        },
      ],
    });
    const field = form.getField(FIELD_ID)! as unknown as DaterangeField;
    expect(field.getFlatpickr()).not.toBeNull();
  });
});
