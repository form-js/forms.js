import { processLicenseKey } from './../../utils';
import { baseTextFieldTestOptions, baseFormOptions, VALIDATION_ERROR } from './../test.options';
import { TextField } from './../../fields/textField';
import { describe, expect, it, jest } from '@jest/globals';
import { createForm, DEFAULT_STRING_VALUE, TEXT_FIELD_ID } from '../test.options';
import * as utils from '../../utils';
import { Field } from '../../field';
import { FormOptions } from '../../interfaces';
import { Form } from '../../index';
import { HTMLElementEvent } from '../../types';
import { LICENSE_STATE } from '../../constants';

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
    expect(field.getType()).toBe('text');
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getValidity()).toBe(null);
    expect(field.isDisabled()).toBeFalsy();
    expect(field.getValidationMessage()).toBe(null);
    expect(field.getForm()).toBe(form);
  });

  it('destroys field, removing it from the DOM', () => {
    const options: FormOptions = {
      ...baseFormOptions,
      schema: [baseTextFieldTestOptions],
    };
    const parent = document.createElement('div');

    const form = new Form(parent, options);
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;
    field.destroy();
    expect(utils.unmountElement).toHaveBeenCalledWith(parent);
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
          }
        }
      ]
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
          }
        }
      ]
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
          }
        }
      ]
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
          }
        }
      ]
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
          required: true
        }
      ]
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
        }
      ]
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
          required: true
        }
      ]
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
    field.load()
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE)
  });

  it('resets correctly', () => {
    const form = createForm();
    const field = form.getField(TEXT_FIELD_ID)! as unknown as TextField;

    field.setValue('bar');
    field.reset();
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
    
    field.setValue('bar');
    field.options.default = undefined;
    field.reset();
    expect(field.getValue()).toBe(null);
  });

});
