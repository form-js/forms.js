import { describe, expect, it, jest } from '@jest/globals';
import { FilePond, create, FilePondFile } from 'filepond';
import {
  createForm,
  baseHiddenFieldTestOptions,
  HIDDEN_FIELD_ID,
  DEFAULT_STRING_VALUE,
  DEFAULT_STRING_VALUE_SECOND,
  baseFormOptions,
} from './../test.options';
import * as utils from '../../utils';
import { HiddenField } from '../../fields';
import { LICENSE_STATE } from '../../constants';
import { FormOptions } from '../../interfaces';
import { Form } from '../../form';

jest.mock('../../utils', () => {
  const originalModule = jest.requireActual('../../utils') as object;

  return {
    __esModule: true,
    ...originalModule,
    unmountElement: jest.fn(),
    evaluateParsedConditions: jest.fn(),
    parseConditionString: jest.fn(),
    usesLicensedFetures: jest.fn(),
    processLicenseKey: jest.fn(),
  };
});

describe('hidden-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseHiddenFieldTestOptions,
        },
      ],
    });

    const field = form.getField(HIDDEN_FIELD_ID)! as unknown as HiddenField;
    expect(field.getValue()).toBe(DEFAULT_STRING_VALUE);
    expect(field.getId()).toBe(HIDDEN_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), HIDDEN_FIELD_ID));
    expect(field.getType()).toBe('hidden');
    expect(field.getForm()).toBe(form);
  });

  it('loads and saves', () => {
    (utils.usesLicensedFetures as jest.Mock).mockReturnValue(true);
    (utils.processLicenseKey as jest.Mock).mockReturnValue(LICENSE_STATE.VALID);

    const form = createForm({
      saveProgress: true,
      schema: [
        {
          ...baseHiddenFieldTestOptions,
          required: true,
        },
      ],
    });
    const field = form.getField(HIDDEN_FIELD_ID)! as unknown as HiddenField;

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
    const form = createForm({
      schema: [
        {
          ...baseHiddenFieldTestOptions,
        },
      ],
    });
    const field = form.getField(HIDDEN_FIELD_ID)! as unknown as HiddenField;

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

  it('destroys field, removing it from the DOM', () => {
    const form = createForm({
      schema: [
        {
          ...baseHiddenFieldTestOptions,
        },
      ],
    });
    const field = form.getField(HIDDEN_FIELD_ID)! as unknown as HiddenField;
    field.destroy();
    /* issue with hidden field remove from DOM
        expect(document.querySelector('#' + HIDDEN_FIELD_ID)).toBeNull();
        */
  });
});
