import { describe, expect, it, jest } from '@jest/globals';
import {
  createForm,
  baseTelephoneFieldTestOptions,
  TELEPHONE_FIELD_ID,
  INVALID_PHONE_VALUE,
  DEFAULT_PHONE_VALUE,
} from './../test.options';
import * as utils from '../../utils';
import { TelField } from '../../fields';

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

describe('tel-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseTelephoneFieldTestOptions,
        },
      ],
    });

    const field = form.getField(TELEPHONE_FIELD_ID)! as unknown as TelField;
    expect(field.getValue()).toBe(DEFAULT_PHONE_VALUE);
    expect(field.getId()).toBe(TELEPHONE_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), TELEPHONE_FIELD_ID));
    expect(field.getType()).toBe('tel');
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseTelephoneFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(TELEPHONE_FIELD_ID)! as unknown as TelField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input uses validate function and detects invalid phone', () => {
    const form = createForm({
      schema: [
        {
          ...baseTelephoneFieldTestOptions,
          required: true,
          default: INVALID_PHONE_VALUE,
        },
      ],
    });
    const field = form.getField(TELEPHONE_FIELD_ID)! as unknown as TelField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input passes validation with valid phone', () => {
    const form = createForm({
      schema: [
        {
          ...baseTelephoneFieldTestOptions,
          required: true,
          default: DEFAULT_PHONE_VALUE,
        },
      ],
    });
    const field = form.getField(TELEPHONE_FIELD_ID)! as unknown as TelField;
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });
});
