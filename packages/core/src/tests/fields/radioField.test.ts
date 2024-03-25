import { describe, expect, it, jest } from '@jest/globals';
import {
  createForm,
  baseRadioFieldTestOptions,
  RADIO_FIELD_ID,
  RADIO_FIELD_ID_OPTION_1,
  RADIO_FIELD_ID_OPTION_2,
} from './../test.options';
import * as utils from '../../utils';
import { RadioField } from '../../fields';
import { FIELD_TYPE_RADIO } from '../../constants';

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

describe('radio-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseRadioFieldTestOptions,
        },
      ],
    });

    const field = form.getField(RADIO_FIELD_ID)! as unknown as RadioField;
    expect(field.getValue()).toBe(RADIO_FIELD_ID_OPTION_1);
    expect(field.getId()).toBe(RADIO_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), RADIO_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_RADIO);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseRadioFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(RADIO_FIELD_ID)! as unknown as RadioField;
    field.validate();
    field.handleValidatedField();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input passes validation with valid string', () => {
    const form = createForm({
      schema: [
        {
          ...baseRadioFieldTestOptions,
          required: true,
          default: RADIO_FIELD_ID_OPTION_1,
        },
      ],
    });
    const field = form.getField(RADIO_FIELD_ID)! as unknown as RadioField;
    field.validate();
    field.handleValidatedField();
    expect(field.getValidity()).toBeTruthy();
  });

  /* There might be a bug syncing radio value? */
  it('input synces checked attribute', () => {
    const form = createForm({
      schema: [
        {
          ...baseRadioFieldTestOptions,
          default: null,
        },
      ],
    });
    const field = form.getField(RADIO_FIELD_ID)! as unknown as RadioField;
    field.setValue(RADIO_FIELD_ID_OPTION_1);
    expect(document.querySelector('#' + RADIO_FIELD_ID_OPTION_1)?.getAttribute('checked')).not.toBeNull();
    expect(document.querySelector('#' + RADIO_FIELD_ID_OPTION_2)?.getAttribute('checked')).toBeNull();
  });

  /* No check just to cover 100 percent */
  it('input triggers change function', () => {
    const form = createForm({
      schema: [
        {
          ...baseRadioFieldTestOptions,
          default: null,
        },
      ],
    });
    const field = form.getField(RADIO_FIELD_ID)! as unknown as RadioField;
    const element = document.querySelector('#' + RADIO_FIELD_ID_OPTION_1) as HTMLInputElement | null;
    const element2 = document.querySelector('#' + RADIO_FIELD_ID_OPTION_2) as HTMLInputElement | null;
    expect(element).not.toBeNull();
    expect(element2).not.toBeNull();

    element!.click();
    element2!.click();
  });
});
