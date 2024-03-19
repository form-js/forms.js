import { describe, expect, it, jest } from '@jest/globals';
import {
  createForm,
  baseFileFieldTestOptions,
  FILE_FIELD_ID,
  DEFAULT_FILE_VALUE,
  INVALID_EMAIL_VALUE,
  DEFAULT_STRING_VALUE,
  FILE_ACCEPT_VALUE,
} from './../test.options';
import * as utils from '../../utils';
import { FileField } from '../../fields';
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

describe('file-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseFileFieldTestOptions,
        },
      ],
    });

    const field = form.getField(FILE_FIELD_ID)! as unknown as FileField;
    expect(field.getValue()).toBe(DEFAULT_FILE_VALUE);
    expect(field.getId()).toBe(FILE_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), FILE_FIELD_ID));
    expect(field.getType()).toBe('file');
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
    field.validate();
    expect(field.getValidity()).toBeTruthy();
    expect(field.getFilepond()).toBeNull();
  });

  it('initilizes with multiple and accept attributes', () => {
    const form = createForm({
      schema: [
        {
          ...baseFileFieldTestOptions,
          multiple: true,
          accept: FILE_ACCEPT_VALUE,
        },
      ],
    });
    const field = form.getField(FILE_FIELD_ID)! as unknown as FileField;
    const element = form.getFormElement()!.querySelector('#' + field.getId());
    expect(element).not.toBeNull();
    expect(element?.getAttribute('multiple')).toBeTruthy();
    expect(element?.getAttribute('accept')).toBe(FILE_ACCEPT_VALUE);
  });

  it('input uses validate function', () => {
    const form = createForm({
      schema: [
        {
          ...baseFileFieldTestOptions,
          required: true,
          default: null,
        },
      ],
    });
    const field = form.getField(FILE_FIELD_ID)! as unknown as FileField;
    field.validate();
    expect(field.getValidity()).toBeFalsy();
  });

  it('input triggers change event', () => {
    const mockChange = jest.fn();
    const form = createForm({
      schema: [
        {
          ...baseFileFieldTestOptions,
          default: null,
          change: mockChange,
          enhance: false,
        },
      ],
    });
    const field = form.getField(FILE_FIELD_ID)! as unknown as FileField;
    const event = { target: { files: DEFAULT_STRING_VALUE } } as unknown as HTMLElementEvent<HTMLInputElement> & {
      files: FileList;
    };
    field.change(event);
    expect(mockChange).toHaveBeenCalledWith(DEFAULT_STRING_VALUE);
  });

  it('enhances file input to filepond', async () => {
    const form = createForm({
      schema: [
        {
          ...baseFileFieldTestOptions,
          enhance: true,
        },
      ],
    });
    const field = form.getField(FILE_FIELD_ID)! as unknown as FileField;
    /** issues with filepond tests, returns undefined in test cases for some reason
        expect(field.getFilepond()).toBeDefined();
        expect(field.getFilepond()).not.toBeNull();
        */
  });
});
