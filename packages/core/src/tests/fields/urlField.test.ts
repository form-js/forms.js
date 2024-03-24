import { describe, expect, it, jest } from '@jest/globals';
import {
  createForm,
  baseUrlFieldTestOptions,
  URL_FIELD_ID,
  INVALID_PHONE_VALUE,
  DEFAULT_URL_VALUE,
} from './../test.options';
import * as utils from '../../utils';
import { UrlField } from '../../fields';
import { FIELD_TYPE_URL } from '../../constants';

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

describe('url-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseUrlFieldTestOptions,
        },
      ],
    });

    const field = form.getField(URL_FIELD_ID)! as unknown as UrlField;
    expect(field.getValue()).toBe(DEFAULT_URL_VALUE);
    expect(field.getId()).toBe(URL_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), URL_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_URL);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseUrlFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(URL_FIELD_ID)! as unknown as UrlField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input uses validate function and detects invalid url', () => {
    const form = createForm({
      schema: [
        {
          ...baseUrlFieldTestOptions,
          required: true,
          default: INVALID_PHONE_VALUE,
        },
      ],
    });
    const field = form.getField(URL_FIELD_ID)! as unknown as UrlField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input passes validation with valid url', () => {
    const form = createForm({
      schema: [
        {
          ...baseUrlFieldTestOptions,
          required: true,
          default: DEFAULT_URL_VALUE,
        },
      ],
    });
    const field = form.getField(URL_FIELD_ID)! as unknown as UrlField;
    field.validate();
    expect(field.getValidity()).toBeTruthy();
  });
});
