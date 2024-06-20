import { describe, expect, it, jest } from '@jest/globals';
import {
  createForm,
  baseSelectFieldTestOptions,
  SELECT_FIELD_ID,
  DEFAULT_SELECT_VALUE,
  SECOND_SELECT_VALUE,
  baseSelectFieldTestOptionsListAsFunction,
} from './../test.options';
import * as utils from '../../utils';
import { SelectField } from '../../fields';
import { HTMLElementEvent } from '../../types';
import { FIELD_TYPE_SELECT } from '../../constants';

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

describe('select-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
        },
      ],
    });

    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    expect(field.getValue()).toBe(DEFAULT_SELECT_VALUE);
    expect(field.getId()).toBe(SELECT_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), SELECT_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_SELECT);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getTomselect()).toBeNull();
    expect(field.getForm()).toBe(form);
  });

  it('uses tom select', () => {
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          enhance: true,
        },
      ],
    });

    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    expect(field.getTomselect()).not.toBeNull();
  });

  it('accepts optionsList as function', async () => {
    jest.useFakeTimers();
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptionsListAsFunction,
        },
      ],
    });

    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    const tomSelect = field.getTomselect();
    expect(tomSelect).not.toBeNull();
    await jest.runAllTimersAsync();
    expect(tomSelect?.getOption(DEFAULT_SELECT_VALUE)).toBeDefined();
    expect(tomSelect?.getOption(DEFAULT_SELECT_VALUE)).not.toBeNull();
  });

  it('handles disabeling', () => {
    let disableSelect = true;
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          enhance: true,
          disabled: () => {
            return disableSelect;
          },
        },
      ],
    });

    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    expect(field.isDisabled()).toBeTruthy();
    disableSelect = false;
    field.update();
    expect(field.isDisabled()).toBeFalsy();
  });

  it('handles multiselect', () => {
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          default: [DEFAULT_SELECT_VALUE, SECOND_SELECT_VALUE],
          multiple: true,
        },
      ],
    });

    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    expect(field.getValue()).toStrictEqual([DEFAULT_SELECT_VALUE, SECOND_SELECT_VALUE]);
  });

  it('synces value', () => {
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          default: DEFAULT_SELECT_VALUE,
        },
      ],
    });

    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    expect(field.getValue()).toBe(DEFAULT_SELECT_VALUE);
    field.setValue(SECOND_SELECT_VALUE);
    expect(field.getValue()).toBe(SECOND_SELECT_VALUE);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
    field.setValue(DEFAULT_SELECT_VALUE);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });

  it('input uses validate function when multiple options allowed', () => {
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          required: true,
          multiple: true,
          default: [],
        },
      ],
    });
    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
    field.setValue([DEFAULT_SELECT_VALUE, SECOND_SELECT_VALUE]);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });

  it('not enhanced input handles change', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          default: null,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    expect(field.getValue()).toBe(null);
    const event = { target: { value: DEFAULT_SELECT_VALUE } } as HTMLElementEvent<HTMLInputElement>;
    field.change(event);
    expect(field.getValue()).toBe(DEFAULT_SELECT_VALUE);
    expect(mockChange).toHaveBeenCalledWith(DEFAULT_SELECT_VALUE);
  });

  it('not enhanced multi input handles change', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          default: null,
          change: mockChange,
          multiple: true,
        },
      ],
    });
    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    const event = { target: { value: SECOND_SELECT_VALUE } } as unknown as HTMLElementEvent<HTMLInputElement>;
    field.setValue([SECOND_SELECT_VALUE]);
    field.change(event);
    expect(mockChange).toHaveBeenCalledWith([SECOND_SELECT_VALUE]);
  });


  it('enhanced input handles change', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseSelectFieldTestOptions,
          default: null,
          change: mockChange,
          enhance: true,
        },
      ],
    });
    const field = form.getField(SELECT_FIELD_ID)! as unknown as SelectField;
    expect(field.getValue()).toBe(null);
    const tomSelect = field.getTomselect();
    tomSelect?.setValue(DEFAULT_SELECT_VALUE); //Need to hack this and set value manualy
    const event = { target: { value: DEFAULT_SELECT_VALUE } } as HTMLElementEvent<HTMLInputElement>;
    field.change(event);
    expect(field.getValue()).toBe(DEFAULT_SELECT_VALUE);
    expect(mockChange).toHaveBeenCalledWith(DEFAULT_SELECT_VALUE);
  });
});
