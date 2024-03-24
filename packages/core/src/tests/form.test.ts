import { describe, expect, test, afterEach, it, jest } from '@jest/globals';
import {
  BUTTON_ID,
  DEFAULT_STRING_VALUE,
  FORM_ID,
  GROUP_ID,
  TEST_LICENSE,
  TEXT_FIELD_ID,
  baseTextFieldTestOptions,
  baseGroupTestOptions,
  baseButtonTestOptions,
  createForm,
  validationFail,
} from './test.options';
import * as utils from '../utils';
import { BUTTON_TYPE_BUTTON, FIELD_TYPE_TEXT, GROUP_TYPE_GROUP, LICENSE_STATE } from '../constants';
import { TextField } from '../fields';
import { Form, GroupOptions, constructorTypes, registerConstructor, FormElement } from '../index';

const groupSaveMock = jest.fn();
const groupLoadMock = jest.fn();
export class dummyGroupClass {
  constructor(parent: HTMLElement, form: Form, options: GroupOptions) {
    this.save = groupSaveMock;
    this.load = groupLoadMock;
    this.update = () => {};
  }

  save: () => void;
  load: () => void;
  update: () => void;
}

/* TODO this class should build its schema like group */
const listButtonMock = jest.fn();
const listGroupMock = jest.fn();
const listFieldMock = jest.fn();

export class dummyListClass {
  private _form: Form;
  private _options: GroupOptions;
  private _parent: HTMLElement;

  constructor(parent: HTMLElement, form: Form, options: GroupOptions) {
    this.update = () => {};
    this.assignButton = listButtonMock;
    this.assignGroup = listGroupMock;
    this.assignField = listFieldMock;
    this._form = form;
    this._options = options;
    this._parent = parent;
  }

  build() {
    this._form.buildSchema(this._options.schema, this._parent, null, this._options.id, 'dummy-key-1');
  }

  getKeyIndex(key: string): number {
    return 0;
  }

  getId() {
    return this._options.id;
  }

  update: () => void;
  assignButton: jest.Mock;
  assignGroup: jest.Mock;
  assignField: jest.Mock;
}

export class dummyListClassNoAssign {
  private _form: Form;
  private _options: GroupOptions;
  private _parent: HTMLElement;

  constructor(parent: HTMLElement, form: Form, options: GroupOptions) {
    this.update = () => {};
    this._form = form;
    this._options = options;
    this._parent = parent;
  }

  build() {
    this._form.buildSchema(this._options.schema, this._parent, null, this._options.id, 'dummy-key-1');
  }

  getKeyIndex(key: string): number {
    return 0;
  }

  getId() {
    return this._options.id;
  }

  update: () => void;
}

/* TODO list field tests */

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

  it('initializes with different options', () => {
    const parent = document.createElement('div');
    parent.id = 'test-parent';
    document.body.appendChild(parent);

    const options = {
      id: 'test-form',
      saveProgress: true,
      useFormData: true,
      schema: [
        {
          type: FIELD_TYPE_TEXT,
          id: 'test-field',
          required: true,
        },
      ],
      action: 'test-action',
      method: 'POST',
      className: 'test-class',
    };
    const form = createForm(options);
    expect(form.getId()).toBe('test-form');
    expect(form.savesProgress()).toBe(true);
    expect(form.getFormElement()!.className).toBe('test-class');
    expect(form.getFormElement()!.method).toBe('post');
    expect(form.getFormElement()!.action).toContain('test-action');
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

  it('updates simple form data correctly', () => {
    const form = createForm();
    form.setData('simpleField', 'initialValue');
    expect(form.getData()['simpleField']).toEqual('initialValue');

    // Update the value
    form.setData('simpleField', 'updatedValue');
    expect(form.getData()['simpleField']).toEqual('updatedValue');

    // Set a null value
    form.setData('simpleField', null);
    expect(form.getData()['simpleField']).toBeNull();
  });

  it('sets data in a nested group correctly', () => {
    const form = createForm({
      schema: [
        {
          type: GROUP_TYPE_GROUP,
          id: 'group1',
          prefixSchema: true,
          schema: [{ type: FIELD_TYPE_TEXT, id: 'nestedField' }],
        },
      ],
    });

    form.setData('nestedField', 'nestedValue');
    expect(form.getData()['group1']['nestedField']).toEqual('nestedValue');

    // Setting data for a non-existing group
    form.setData('nonExistingGroup.nestedField', 'value');
    expect(form.getData()['nonExistingGroup']).toBeUndefined();
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

      form.reset(new Event('reset') as Event);

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

  it('resets form and all elements to initial state', () => {
    const form = createForm({
      schema: [
        { type: FIELD_TYPE_TEXT, id: 'field1', default: 'default1' },
        {
          type: GROUP_TYPE_GROUP,
          id: 'group1',
          prefixSchema: true,
          schema: [{ type: FIELD_TYPE_TEXT, id: 'groupField', default: 'default2' }],
        },
        {
          type: BUTTON_TYPE_BUTTON,
          id: 'button1',
        },
      ],
    });

    // Simulate changes to the form data
    form.setData('field1', 'changedValue1');
    form.setData('groupField', 'changedValue2');

    form.reset();

    // Verify data has been reset
    expect(form.getData()['field1']).toEqual('default1');
    expect(form.getData()['group1']['groupField']).toEqual('default2');
  });

  it('submits the form with valid data', () => {
    const mockFormSubmit = jest.fn();

    const form = createForm({
      submit: mockFormSubmit,
    });

    form.updateError(TEXT_FIELD_ID, true);

    const element = form.getFormElement()!;
    element.submit();

    expect(mockFormSubmit).toHaveBeenCalled();
  });

  it('accents string as first parameter', () => {
    const div = document.createElement('div');
    div.id = 'test-form-parent';
    document.body.append(div);

    const form = new Form('test-form-parent', {
      id: FORM_ID,
      schema: [],
    });

    expect(form.getId()).toBe(FORM_ID);
  });

  it('throws error when no element available', () => {
    expect(
      () =>
        new Form('test-form-parent', {
          id: FORM_ID,
          schema: [],
        }),
    ).toThrowError();
  });

  it('submits with an action', () => {
    const mockFormSubmit = jest.fn();
    const mockPreventDefault = jest.fn();
    const mockEvent = { preventDefault: mockPreventDefault } as unknown as SubmitEvent;

    const form = createForm({
      method: 'POST',
      action: 'http://example.com/submit',
    });

    form.updateError(TEXT_FIELD_ID, true);

    const formElement = form.getFormElement()!;
    formElement.submit = jest.fn();

    form.submit(mockEvent, form);

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(formElement.submit).toHaveBeenCalled();
  });

  describe('converts object to form data', () => {
    it('calls objectToFormData when submitting with useFormData option', () => {
      const mockSubmitHandler = jest.fn();
      const form = createForm({
        useFormData: true,
        submit: mockSubmitHandler,
      });

      form.updateError(TEXT_FIELD_ID, true);

      const element = form.getFormElement()!;
      element.submit();

      expect(mockSubmitHandler).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  /* List fields */
  it('handles list field correctly', () => {
    registerConstructor('list', dummyListClass, constructorTypes.field);
    registerConstructor('list-no-assign', dummyListClassNoAssign, constructorTypes.field);

    const form = createForm({
      schema: [
        {
          type: 'list',
          id: 'list1',
          schema: [
            { ...baseTextFieldTestOptions },
            {
              ...baseGroupTestOptions,
              prefixSchema: true,
              schema: [
                {
                  ...baseTextFieldTestOptions,
                  id: 'text2',
                },
              ],
            },
            {
              ...baseButtonTestOptions,
            },
          ],
        },
        {
          type: 'list-no-assign',
          id: 'list2',
          schema: [
            { ...baseTextFieldTestOptions },
            { ...baseGroupTestOptions },
            {
              ...baseButtonTestOptions,
            },
          ],
        },
      ],
    });

    expect(form.getField('list1')).toBeDefined();
    expect(form.getField('list2')).toBeDefined();

    const list1 = form.getField('list1')! as unknown as dummyListClass;
    list1.build();
    const list2 = form.getField('list2')! as unknown as dummyListClassNoAssign;
    list2.build();

    expect(listButtonMock).toHaveBeenCalled();
    expect(listGroupMock).toHaveBeenCalled();
    expect(listFieldMock).toHaveBeenCalled();

    /* ensureDataStructureExists and setDataFromMap */
    form.setData('list1[dummy-key-1]test-text-field', 'value1');
    expect(form.getData()).toHaveProperty('list1');
    expect(form.getData()['list1'][0]).toHaveProperty('test-text-field');
    expect(form.getData()['list1'][0]['test-text-field']).toBe('value1');
  });

  it('removes list data correctly', () => {
    const form = createForm();
    form.setData('listField', [{}, {}, {}]);
    expect(form.getData()['listField'].length).toEqual(3);

    form.removeListData('listField', 1);
    expect(form.getData()['listField'].length).toEqual(2);
  });

  it('does not save without license', () => {
    const form = createForm();

    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.setItem = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.setItem = jest.fn();

    form.save();
    expect(localStorage.setItem).not.toHaveBeenCalled();

    form.load();
    expect(localStorage.getItem).not.toHaveBeenCalled();
  });

  it('saves data and loads saved form data if progress saving is enabled and license is valid', () => {
    (utils.usesLicensedFetures as jest.Mock).mockReturnValue(true);
    (utils.processLicenseKey as jest.Mock).mockReturnValue(LICENSE_STATE.VALID);

    registerConstructor('dummy-group', dummyGroupClass, constructorTypes.group);

    const form = createForm({
      saveProgress: true,
      licenseKey: TEST_LICENSE,
      schema: [
        {
          type: GROUP_TYPE_GROUP,
          id: 'group1',
          shcema: [],
        },
        {
          type: 'dummy-group',
          id: 'group2',
          shcema: [],
        },
        {
          ...baseTextFieldTestOptions,
        },
      ],
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
      expect(groupSaveMock).toHaveBeenCalled();

      form.load();
      expect(localStorage.getItem).toHaveBeenCalledWith(saveKey);
      expect(groupLoadMock).toHaveBeenCalled();
    }
  });

  it('does not allow undefined field types', () => {
    expect(() =>
      createForm({
        id: FORM_ID,
        schema: [
          {
            type: 'undefined-field',
            id: 'undefined',
          },
        ],
      }),
    ).toThrowError();
  });

  it('destroys form, removing it from the DOM', () => {
    const form = createForm();
    form.destroy();

    const formElement = document.getElementById(form.getId());
    expect(formElement).toBeNull();
  });

  it('updates form error state correctly', () => {
    const form = createForm();
    // Initially, there should be no errors
    expect(form.isValid()).toBeNull();

    // Simulate an error
    form.updateError('test-field', false);
    expect(form.isValid()).toBeFalsy();

    // Resolve the error
    form.updateError('test-field', true);
    expect(form.isValid()).toBeTruthy();
  });

  it('validates nested group fields correctly', () => {
    const nestedGroupSchema = [
      {
        type: GROUP_TYPE_GROUP,
        id: 'nestedGroup',
        schema: [{ type: FIELD_TYPE_TEXT, id: 'nestedField', required: true }],
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
          type: BUTTON_TYPE_BUTTON,
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
          type: GROUP_TYPE_GROUP,
          id: GROUP_ID,
        },
      ],
    });
    expect(form.getGroups()).toHaveProperty(GROUP_ID);
    expect(form.getGroup(GROUP_ID)).toBeDefined();
  });
});
