import { describe, expect, test, afterEach, it, jest } from '@jest/globals';
import {
  BUTTON_ID,
  DEFAULT_STRING_VALUE,
  FORM_ID,
  GROUP_ID,
  TEST_LICENSE,
  TEXT_FIELD_ID,
  baseTextFieldTestOptions,
  createForm,
  validationFail,
} from './test.options';
import * as utils from '../utils';
import { LICENSE_STATE } from '../constants';
import { TextField } from '../fields';

jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils') as object;

  return {
    __esModule: true,
    ...originalModule,
    processLicenseKey: jest.fn(),
    setLicenseKey: jest.fn(),
    mountElement: jest.fn(),
    unmountElement: jest.fn(),
    usesLicensedFetures: jest.fn(),
  };
});

describe('form', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('initializes and mounts form element to parent', () => {
    createForm();
    expect(utils.mountElement).toHaveBeenCalled();
  });

  it('processes license key correctly', () => {
    (utils.usesLicensedFetures as jest.Mock).mockReturnValue(true);
    (utils.processLicenseKey as jest.Mock).mockReturnValue(LICENSE_STATE.VALID);

    global.console = {
      ...global.console,
      error: jest.fn(),
    };

    const form = createForm({
      licenseKey: TEST_LICENSE,
    });

    expect(utils.setLicenseKey).toHaveBeenCalledWith(TEST_LICENSE);
    expect(form.hasValidLicense()).toBeTruthy();
    global.console = {
      ...global.console,
      error: console.error,
    };
  });

  it('handles invalid license log', () => {
    (utils.usesLicensedFetures as jest.Mock).mockReturnValue(true);
    (utils.processLicenseKey as jest.Mock).mockReturnValue(LICENSE_STATE.INVALID);

    global.console = {
      ...global.console,
      error: jest.fn(),
    };

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    createForm();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    global.console = {
      ...global.console,
      error: console.error,
    };
  });

  it('builds schema elements correctly', () => {
    const form = createForm();
    expect(form.getField(TEXT_FIELD_ID)).toBeDefined();
  });

  it('sets form data', async () => {
    const form = createForm();
    form.setData('fieldName', 'fieldValue');
    expect(form.getData()['fieldName']).toEqual('fieldValue');
  });

  it('validates form and prevents submission if not valid', () => {
    const form = createForm();
    const mockPreventDefault = jest.fn();
    const mockEvent = { preventDefault: mockPreventDefault } as unknown as SubmitEvent;

    form.submit(mockEvent, form);
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('updates form elements correctly', () => {
    const form = createForm();
    const field = form.getField(TEXT_FIELD_ID);
    if (field) {
      const mockedUpdate = jest.fn();
      field.update = mockedUpdate;
      form.update();
      expect(field.update).toHaveBeenCalled();
    }
  });

  it('resets form correctly, clearing data and errors', () => {
    const form = createForm({
      schema: [
        {
          ...baseTextFieldTestOptions,
          validation: validationFail,
        },
      ],
    });

    const field = form.getField(TEXT_FIELD_ID) as TextField | undefined;
    if (field) {
      field.setValue('bar');
      field.validate();
      const expectedBeforeReset: Record<string, any> = {};
      expectedBeforeReset[TEXT_FIELD_ID] = 'bar';
      expect(form.getData()).toEqual(expectedBeforeReset);
      expect(form.isValid()).toBeFalsy();

      form.reset();

      const expected: Record<string, any> = {};
      expected[TEXT_FIELD_ID] = DEFAULT_STRING_VALUE;
      expect(form.getData()).toEqual(expected);
      expect(form.isValid()).toBeNull();
    }
  });

  it('resets form elements correctly', () => {
    const form = createForm();
    const field = form.getField(TEXT_FIELD_ID);
    if (field) {
      const mockedReset = jest.fn();
      field.reset = mockedReset;
      form.reset();
      expect(field.reset).toHaveBeenCalled();
    }
  });

  /*describe('converts object to form data', () => {
    it('calls objectToFormData when submitting with useFormData option', () => {
      const mockPreventDefault = jest.fn();
      const mockSubmitEvent = { preventDefault: mockPreventDefault } as unknown as SubmitEvent;
      const mockSubmitHandler = jest.fn();
      const form = createForm({
        useFormData: true,
        submit: mockSubmitHandler,
      });

      form.submit(mockSubmitEvent, form);
      expect(mockSubmitHandler).toHaveBeenCalledWith(expect.any(FormData));
    });
  });*/

  it('removes list data correctly', () => {
    const form = createForm();
    form.setData('listField', [{}, {}, {}]);
    expect(form.getData()['listField'].length).toEqual(3);

    form.removeListData('listField', 1);
    expect(form.getData()['listField'].length).toEqual(2);
  });

  it('saves data and loads saved form data if progress saving is enabled and license is valid', () => {
    (utils.usesLicensedFetures as jest.Mock).mockReturnValue(true);
    (utils.processLicenseKey as jest.Mock).mockReturnValue(LICENSE_STATE.VALID);

    const form = createForm({
      saveProgress: true,
      licenseKey: TEST_LICENSE,
    });

    const field = form.getField(TEXT_FIELD_ID) as TextField | undefined;

    if (field) {
      jest.spyOn(Storage.prototype, 'setItem');
      Storage.prototype.setItem = jest.fn();
      jest.spyOn(Storage.prototype, 'getItem');
      Storage.prototype.setItem = jest.fn();
      const saveKey = utils.generateFieldSaveKey(form.getId(), TEXT_FIELD_ID);

      form.save();
      expect(localStorage.setItem).toHaveBeenCalledWith(saveKey, JSON.stringify(DEFAULT_STRING_VALUE));

      form.load();
      expect(localStorage.getItem).toHaveBeenCalledWith(saveKey);
    }
  });

  /*it('handles form submission with valid data', () => {
    const submit = jest.fn();

    const form = createForm({
      submit: submit,
    });

    form.submit(new Event('SubmitEvent') as SubmitEvent, form);

    expect(submit).toHaveBeenCalled();
  });*/

  it('destroys form, removing it from the DOM', () => {
    const form = createForm();
    form.destroy();

    const formElement = document.getElementById(form.getId());
    expect(formElement).toBeNull();
  });

  it('validates nested group fields correctly', () => {
    const nestedGroupSchema = [
      {
        type: 'group',
        id: 'nestedGroup',
        schema: [{ type: 'text', id: 'nestedField', required: true }],
      },
    ];

    const form = createForm({
      schema: nestedGroupSchema,
    });
    form.validate();

    expect(form.isValid()).toBeFalsy();
  });

  test('gets field', () => {
    const form = createForm();
    expect(form.getField(TEXT_FIELD_ID)).toBeDefined();
  });

  test('gets form element', () => {
    const form = createForm();
    expect(form.getFormElement()).toBeDefined();
  });

  test('has id', () => {
    const form = createForm();
    expect(form.getId()).toBe(FORM_ID);
  });

  test('has form data', () => {
    const form = createForm();
    const expected: Record<string, any> = {};
    expected[TEXT_FIELD_ID] = DEFAULT_STRING_VALUE;
    expect(form.getData()).toMatchObject(expected);
  });

  test('has button', () => {
    const form = createForm({
      schema: [
        {
          type: 'button',
          id: BUTTON_ID,
        },
      ],
    });
    expect(form.getButtons()).toHaveProperty(BUTTON_ID);
    expect(form.getButton(BUTTON_ID)).toBeDefined();
  });

  test('has group', () => {
    const form = createForm({
      schema: [
        {
          type: 'group',
          id: GROUP_ID,
        },
      ],
    });
    expect(form.getGroups()).toHaveProperty(GROUP_ID);
    expect(form.getGroup(GROUP_ID)).toBeDefined();
  });
});
