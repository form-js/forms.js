import {
  baseTextFieldTestOptions,
  VALIDATION_ERROR,
  DEFAULT_STRING_VALUE_SECOND,
  createForm,
  DEFAULT_STRING_VALUE,
  TEXT_FIELD_ID,
} from './../test.options';
import { TextField } from './../../fields/textField';
import { describe, expect, it, jest } from '@jest/globals';
import * as utils from '../../utils';
import { Field } from '../../field';
import { HTMLElementEvent } from '../../types';
import { DIV_ELEMENT, FIELD_TYPE_TEXT, FieldEvents, LICENSE_STATE } from '../../constants';

jest.mock('../../utils', () => {
  const originalModule = jest.requireActual('../../utils') as object;

  return {
    __esModule: true,
    ...originalModule,
    mountElement: jest.fn(),
    unmountElement: jest.fn(),
    evaluateParsedConditions: jest.fn(),
    parseConditionString: jest.fn(),
    usesLicensedFetures: jest.fn(),
    processLicenseKey: jest.fn(),
  };
});

describe('text-field', () => {
  it('core field class gets field value', () => {
    const form = createForm();
    const field = new Field(form.getFormElement()!, form, baseTextFieldTestOptions);
    field.setValue(DEFAULT_STRING_VALUE);
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
  });

  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          conditions: 'test',
          disabled: 'test',
          required: 'test',
          validation: 'test',
          placeholder: 'test',
          default: undefined,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    expect(field.getValue()).toBe(null);
    expect(field.getId()).toBe(TEXT_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), TEXT_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_TEXT);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getValidity()).toBe(null);
    expect(field.isDisabled()).toBeFalsy();
    expect(field.getValidationMessage()).toBe(null);
    expect(field.getForm()).toBe(form);
  });

  it('destroys field, removing it from the DOM', () => {
    const form = createForm({
      schema: [baseTextFieldTestOptions],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.destroy();
    expect(document.querySelector('#' + TEXT_FIELD_ID)).toBeNull();
  });

  it('handles conditions as function correcrtly', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          conditions: (value: string, data: object) => {
            if (value === DEFAULT_STRING_VALUE) return false;
            return true;
          },
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.setValue(DEFAULT_STRING_VALUE);
    field.update();
    expect(field.getVisibility()).toBeFalsy();
  });

  it('handles validation correctly', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          validation: (value: string, data: object) => {
            if (value === DEFAULT_STRING_VALUE) return VALIDATION_ERROR;
            return true;
          },
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    expect(field.getValidity()).toBe(null);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
    field.handleValidatedField();
    field.setValue(DEFAULT_STRING_VALUE);
    field.validate();
    field.handleValidatedField();
    expect(field.getValidity()).toBeFalsy();
    expect(field.getValidationMessage()).toBe(VALIDATION_ERROR);
  });

  it('handles disability correctly', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          disabled: (value: string, data: object) => {
            if (value === DEFAULT_STRING_VALUE) return true;
            return false;
          },
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    expect(field.isDisabled()).toBe(false);
    field.update();
    expect(field.isDisabled()).toBe(false);
    field.setValue(DEFAULT_STRING_VALUE);
    field.update();
    expect(field.isDisabled()).toBe(true);
  });

  it('handles required function correctly', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          required: (value: string, data: object) => {
            if (value === DEFAULT_STRING_VALUE) return true;
            return false;
          },
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    expect(field.isRequired()).toBe(false);
    field.update();
    expect(field.isRequired()).toBe(false);
    field.setValue(DEFAULT_STRING_VALUE);
    field.update();
    expect(field.isRequired()).toBe(true);
  });

  it('handles required static value correctly', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          required: true,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    expect(field.isRequired()).toBe(true);
  });

  it('changes value', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          change: mockChange,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    expect(field.getValue()).toBe(null);
    const event = { target: { value: DEFAULT_STRING_VALUE } } as HTMLElementEvent<HTMLInputElement>;
    field.change(event);
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
    expect(mockChange).toHaveBeenCalledWith(DEFAULT_STRING_VALUE);
  });

  it('loads and saves', () => {
    (utils.usesLicensedFetures as jest.Mock).mockReturnValue(true);
    (utils.processLicenseKey as jest.Mock).mockReturnValue(LICENSE_STATE.VALID);

    const form = createForm({
      saveProgress: true,
      schema: [
        {
          ...baseTextFieldTestOptions,
          required: true,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;

    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.setItem = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem = jest.fn(() => DEFAULT_STRING_VALUE);

    field.setValue(DEFAULT_STRING_VALUE);
    field.save();
    expect(localStorage.setItem).toHaveBeenCalled();

    field.setValue(null);
    field.load();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
  });

  it('resets correctly', () => {
    const form = createForm();
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;

    field.setValue(DEFAULT_STRING_VALUE_SECOND);
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE_SECOND);
    field.reset();
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);

    field.setValue(DEFAULT_STRING_VALUE_SECOND);
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE_SECOND);
    field.options.default = undefined;
    field.reset();
    expect(field.getValue()).toBe(null);
  });

  it('parses string conditions correctly', () => {
    (utils.parseConditionString as jest.Mock).mockReturnValue([{ conditions: [], returnValue: true }]);
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          conditions: DEFAULT_STRING_VALUE_SECOND,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.initialize();
    expect(utils.parseConditionString).toHaveBeenCalledWith(DEFAULT_STRING_VALUE_SECOND);
  });

  it('updates visibility based on conditions string', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          conditions: DEFAULT_STRING_VALUE_SECOND,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.update();
    expect(field.getVisibility()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    field.update();
    expect(field.getVisibility()).toBe(false);
  });

  it('updates disabled based on conditions string', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          disabled: DEFAULT_STRING_VALUE_SECOND,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.update();
    expect(field.isDisabled()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    field.update();
    expect(field.isDisabled()).toBe(false);
  });

  it('updates disabled based on boolean', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          disabled: true,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.update();
    expect(field.isDisabled()).toBe(true);
  });

  it('updates required based on conditions string', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          required: DEFAULT_STRING_VALUE_SECOND,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.update();
    expect(field.isRequired()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    field.update();
    expect(field.isRequired()).toBe(false);
  });

  it('updates validation based on conditions string', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          required: false,
          default: null,
          validation: DEFAULT_STRING_VALUE_SECOND,
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.validate();
    expect(field.getValidity()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    field.validate();
    expect(field.getValidity()).toBe(false);
  });

  it('updates validation edge conditions work', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          required: true,
          default: null,
          validation: DEFAULT_STRING_VALUE_SECOND,
          conditions: (value: string, data: object) => {
            if (value === DEFAULT_STRING_VALUE) return false;
            return true;
          },
        },
      ],
    });
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    field.validate();
    expect(field.getValidity()).toBe(false);

    field.setValue(DEFAULT_STRING_VALUE);
    field.update();
    field.validate();
    expect(field.getValidity()).toBe(false);

    const form2 = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          validation: true,
        },
      ],
    });
    const field2 = form2.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field2.validate();
    expect(field2.getValidity()).toBe(true);
    field2.options.validation = undefined;
    field2.validate();
    expect(field2.getValidity()).toBe(true);
  });

  it('accepts label as function', () => {
    const mockFunction = jest.fn();
    mockFunction.mockReturnValue(document.createElement(DIV_ELEMENT));
    createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          label: mockFunction,
        },
      ],
    });

    expect(mockFunction).toHaveBeenCalled();
  });

  it('triggers events properly', () => {
    const mockChangedListener = jest.fn();
    const mockResettedListener = jest.fn();
    const mockDisabledStateChangedListener = jest.fn();
    const mockRequiredStateChangedListener = jest.fn();
    const mockValidationFailedListener = jest.fn();
    const mockVisibilityChangedListener = jest.fn();

    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          default: null,
          disabled: (value: string) => {
            return value === 'disabled';
          },
          required: (value: string) => {
            return value === 'required';
          },
          conditions: (value: string) => {
            return value !== 'conditions';
          },
          validation: (value: string | null) => {
            if (!value) return 'failed';
            return true;
          },
        },
      ],
    });

    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;

    field?.on(FieldEvents.Changed, mockChangedListener, true);
    field?.on(FieldEvents.DisabledStateChanged, mockDisabledStateChangedListener, true);
    field?.on(FieldEvents.RequiredStateChanged, mockRequiredStateChangedListener, true);
    field?.on(FieldEvents.Resetted, mockResettedListener, true);
    field?.on(FieldEvents.ValidationFailed, mockValidationFailedListener, true);
    field?.on(FieldEvents.VisibilityChanged, mockVisibilityChangedListener, true);

    field?.setValue('disabled');
    field?.update();
    expect(mockDisabledStateChangedListener).toHaveBeenCalledTimes(1);
    field?.setValue('required');
    field?.update();
    expect(mockDisabledStateChangedListener).toHaveBeenCalledTimes(2);
    expect(mockRequiredStateChangedListener).toHaveBeenCalledTimes(1);
    field?.setValue('conditions');
    field?.update();
    expect(mockRequiredStateChangedListener).toHaveBeenCalledTimes(2);
    expect(mockVisibilityChangedListener).toHaveBeenCalledTimes(1);
    field?.setValue(null);
    field?.validate();
    expect(mockVisibilityChangedListener).toHaveBeenCalledTimes(2);
    expect(mockValidationFailedListener).toHaveBeenCalledTimes(1);
    field?.reset();
    expect(mockResettedListener).toHaveBeenCalledTimes(1);
    const event = { target: { value: DEFAULT_STRING_VALUE } } as HTMLElementEvent<HTMLInputElement>;
    field?.change(event);
    expect(mockChangedListener).toHaveBeenCalledTimes(1);

    field?.off(FieldEvents.Changed, mockChangedListener, true);
    field?.off(FieldEvents.DisabledStateChanged, mockDisabledStateChangedListener, true);
    field?.off(FieldEvents.RequiredStateChanged, mockRequiredStateChangedListener, true);
    field?.off(FieldEvents.Resetted, mockResettedListener, true);
    field?.off(FieldEvents.ValidationFailed, mockValidationFailedListener, true);
    field?.off(FieldEvents.VisibilityChanged, mockVisibilityChangedListener, true);

    field?.setValue('disabled');
    field?.update();
    expect(mockDisabledStateChangedListener).toHaveBeenCalledTimes(2);
    field?.setValue('required');
    field?.update();
    expect(mockDisabledStateChangedListener).toHaveBeenCalledTimes(2);
    expect(mockRequiredStateChangedListener).toHaveBeenCalledTimes(2);
    field?.setValue('conditions');
    field?.update();
    expect(mockRequiredStateChangedListener).toHaveBeenCalledTimes(2);
    expect(mockVisibilityChangedListener).toHaveBeenCalledTimes(2);
    field?.setValue(null);
    field?.validate();
    expect(mockValidationFailedListener).toHaveBeenCalledTimes(1);
    field?.reset();
    expect(mockResettedListener).toHaveBeenCalledTimes(1);
    field?.change(event);
    expect(mockChangedListener).toHaveBeenCalledTimes(1);
  });
});
