import { CheckboxField } from './../../fields/checkboxField';
import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseCheckboxFieldTestOptions, CHECKBOX_FIELD_ID, DEFAULT_BOOL_VALUE } from './../test.options';
import * as utils from '../../utils';
import { HTMLElementEvent } from '../../types';

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

describe('checkbox-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseCheckboxFieldTestOptions,
        },
      ],
    });

    const field = form.getField(CHECKBOX_FIELD_ID)! as unknown as CheckboxField;
    expect(field.getValue()).toBe(DEFAULT_BOOL_VALUE);
    expect(field.getId()).toBe(CHECKBOX_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), CHECKBOX_FIELD_ID));
    expect(field.getType()).toBe('checkbox');
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('creates toggle', () => {
    const form = createForm({
      schema: [
        {
          ...baseCheckboxFieldTestOptions,
          toggle: true,
          name: undefined,
        },
      ],
    });

    const field = form.getField(CHECKBOX_FIELD_ID)! as unknown as CheckboxField;
    const element = form.getFormElement()!.querySelector('#' + field.getId() + '_container');
    expect(element).not.toBeNull();
    expect(element?.classList.contains('is-toggle')).toBeTruthy();
  });

  it('changes value', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseCheckboxFieldTestOptions,
          default: false,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(CHECKBOX_FIELD_ID)! as unknown as CheckboxField;
    expect(field.getValue()).toBe(false);
    const event = { target: { checked: DEFAULT_BOOL_VALUE } } as unknown as HTMLElementEvent<HTMLInputElement>;
    field.change(event);
    expect(field.getValue()).toBe(DEFAULT_BOOL_VALUE);
    expect(mockChange).toHaveBeenCalledWith(DEFAULT_BOOL_VALUE);
    field.setValue(false);
    const element = form.getFormElement()!.querySelector('#' + field.getId());
    expect(element).not.toBeNull();
    expect(element!.getAttribute('checked')).toBeNull();
  });

  it('input triggers change event', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseCheckboxFieldTestOptions,
          default: false,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(CHECKBOX_FIELD_ID)! as unknown as CheckboxField;
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
          ...baseCheckboxFieldTestOptions,
          required: true,
          default: false,
        },
      ],
    });
    const field = form.getField(CHECKBOX_FIELD_ID)! as unknown as CheckboxField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });
});
