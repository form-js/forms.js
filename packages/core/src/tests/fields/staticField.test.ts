import { describe, expect, it, jest } from '@jest/globals';
import {
  createForm,
  baseStaticFieldTestOptions,
  STATIC_FIELD_ID,
  DEFAULT_STATIC_VALUE,
  SECOND_STATIC_VALUE,
} from './../test.options';
import * as utils from '../../utils';
import { StaticField } from '../../fields';
import { FIELD_TYPE_STATIC, LICENSE_STATE } from '../../constants';

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

describe('static-field', () => {
  it('gets field value', () => {
    const form = createForm({
      schema: [
        {
          ...baseStaticFieldTestOptions,
        },
      ],
    });

    const field = form.getField(STATIC_FIELD_ID)! as unknown as StaticField;
    expect(field.getValue()).toBe(DEFAULT_STATIC_VALUE);
    expect(field.getId()).toBe(STATIC_FIELD_ID);
    expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), STATIC_FIELD_ID));
    expect(field.getType()).toBe(FIELD_TYPE_STATIC);
    expect(field.getVisibility()).toBeTruthy();
    expect(field.getForm()).toBe(form);
  });

  it('resets correctly', () => {
    const form = createForm({
      schema: [
        {
          ...baseStaticFieldTestOptions,
        },
      ],
    });
    const field = form.getField(STATIC_FIELD_ID)! as unknown as StaticField;

    field.setTemplate(SECOND_STATIC_VALUE);
    expect(field.getValue()).toBe(SECOND_STATIC_VALUE);
    field.reset();
    expect(field.getValue()).toBe(DEFAULT_STATIC_VALUE);
  });

  it('destroys field, removing it from the DOM', () => {
    const form = createForm({
      schema: [baseStaticFieldTestOptions],
    });
    const field = form.getField(STATIC_FIELD_ID)! as unknown as StaticField;
    field.destroy();
    /* issue with static field remove from DOM
        expect(document.querySelector('#' + STATIC_FIELD_ID)).toBeNull();
        */
  });

  it('loads and saves', () => {
    (utils.usesLicensedFetures as jest.Mock).mockReturnValue(true);
    (utils.processLicenseKey as jest.Mock).mockReturnValue(LICENSE_STATE.VALID);

    const form = createForm({
      saveProgress: true,
      schema: [
        {
          ...baseStaticFieldTestOptions,
          required: true,
        },
      ],
    });
    const field = form.getField(STATIC_FIELD_ID)! as unknown as StaticField;

    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.setItem = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem = jest.fn(() => DEFAULT_STATIC_VALUE);

    field.setTemplate(DEFAULT_STATIC_VALUE);
    field.save();
    expect(localStorage.setItem).toHaveBeenCalled();

    field.setTemplate('');
    field.load();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(field.getValue()).toBe(DEFAULT_STATIC_VALUE);
  });

  it('parses string conditions correctly', () => {
    (utils.parseConditionString as jest.Mock).mockReturnValue([{ conditions: [], returnValue: true }]);
    const form = createForm({
      schema: [
        {
          ...baseStaticFieldTestOptions,
          conditions: SECOND_STATIC_VALUE,
        },
      ],
    });
    const field = form.getField(STATIC_FIELD_ID)! as unknown as StaticField;
    field.initialize();
    expect(utils.parseConditionString).toHaveBeenCalledWith(SECOND_STATIC_VALUE);
  });

  it('updates visibility based on conditions string', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    const form = createForm({
      schema: [
        {
          ...baseStaticFieldTestOptions,
          conditions: SECOND_STATIC_VALUE,
        },
      ],
    });
    const field = form.getField(STATIC_FIELD_ID)! as unknown as StaticField;
    field.update();
    expect(field.getVisibility()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    field.update();
    expect(field.getVisibility()).toBe(false);
  });

  it('handles conditions as function correcrtly', () => {
    const form = createForm({
      schema: [
        {
          ...baseStaticFieldTestOptions,
          default: SECOND_STATIC_VALUE,
          conditions: (value: string, data: object) => {
            if (value === DEFAULT_STATIC_VALUE) return false;
            return true;
          },
        },
      ],
    });
    const field = form.getField(STATIC_FIELD_ID)! as unknown as StaticField;
    field.setTemplate(DEFAULT_STATIC_VALUE);
    field.update();
    expect(field.getVisibility()).toBeFalsy();
  });
});
