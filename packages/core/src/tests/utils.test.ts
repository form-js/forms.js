import { describe, expect, test, it, jest, afterEach } from '@jest/globals';
import { Button } from '../button';
import { TextField } from '../fields';
import { Group } from '../group';
import { ParsedCondition } from '../types';
import {
  INVALID_CONSOLE_TEXT,
  INVALID_LICENSE_TEXT,
  LICENSE_STATE,
  OUTDATED_CONSOLE_TEXT,
  OUTDATED_LICENSE_TEXT,
  VALID_LICENSE_TEXT,
  constructorTypes,
  registerConstructor,
} from './../constants';
import {
  debounce,
  mountElement,
  unmountElement,
  objectToFormData,
  isField,
  isGroup,
  isButton,
  setLicenseKey,
  processLicenseKey,
  getFormElementType,
  extractFieldsFromSchema,
  createWrapper,
  generateFieldSaveKey,
  parseConditionString,
  transformFieldName,
  evaluateParsedConditions,
  getLicenseText,
  handleInvalidLicenseLog,
  useLicensedFetures,
  usesLicensedFetures,
  compareValues,
  isJson,
} from './../utils';

describe('formUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('delays the execution of the callback', () => {
      const callback = jest.fn();
      const debouncedFunction = debounce(callback, 1000, null);
      debouncedFunction();

      expect(callback).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('executes the callback only once for rapid successive calls', () => {
      const callback = jest.fn();
      const debouncedFunction = debounce(callback, 1000, null);

      debouncedFunction();
      debouncedFunction();
      debouncedFunction();

      jest.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('applies the correct context and arguments to the callback', () => {
      const callback = jest.fn(function (this: { value: number }) {
        return this.value;
      });
      const context = { value: 42 };
      const debouncedFunction: (...args: any[]) => void = debounce(callback, 1000, context);
      const arg1 = 'test',
        arg2 = 123;

      debouncedFunction(arg1, arg2);
      jest.runAllTimers();

      expect(callback).toHaveBeenCalledWith(arg1, arg2);
    });
  });

  describe('mountElement and unmountElement', () => {
    it('should correctly mount and unmount an element', () => {
      document.body.innerHTML = '<div id="parent"></div>';
      const parent = document.getElementById('parent') as HTMLElement;
      const child = document.createElement('div');
      mountElement(child, parent);
      expect(parent.contains(child)).toBeTruthy();

      unmountElement(child);
      expect(parent.contains(child)).toBeFalsy();
    });
  });

  describe('objectToFormData', () => {
    it('should convert an object to FormData', () => {
      const obj = { key: 'value', nested: { nestedKey: 'nestedValue' }, null: null };
      const formData = objectToFormData(obj);
      expect(formData.get('key')).toEqual('value');
      expect(formData.get('nested[nestedKey]')).toEqual('nestedValue');
    });
  });

  describe('isField, isGroup, isButton', () => {
    registerConstructor('text', TextField, 'field');
    registerConstructor('group', Group, 'group');
    registerConstructor('button', Button, 'button');

    it('should identify field, group, and button types', () => {
      expect(isField('text')).toBeTruthy();
      expect(isGroup('group')).toBeTruthy();
      expect(isButton('button')).toBeTruthy();
    });
  });

  describe('processLicenseKey', () => {
    it('should return invalid state when license key is invalid', () => {
      setLicenseKey('invalidLicenseKey');
      expect(processLicenseKey()).toEqual(LICENSE_STATE.INVALID);
    });

    it('should return invalid state when no key set', () => {
      setLicenseKey('');
      expect(processLicenseKey()).toEqual(LICENSE_STATE.INVALID);
    });

    it('should return outdated license when key is outdated', () => {
      setLicenseKey('1234567891@1614267797');
      expect(processLicenseKey()).toEqual(LICENSE_STATE.OUTDATED);
    });

    it('should return valid license when open source or cc key', () => {
      setLicenseKey('GPL-My-Project-Is-Open-Source');
      expect(processLicenseKey()).toEqual(LICENSE_STATE.VALID);
      setLicenseKey('CC-Attribution-NonCommercial-NoDerivatives');
      expect(processLicenseKey()).toEqual(LICENSE_STATE.VALID);
    });
  });

  describe('getLicenseText', () => {
    it('should return the correct license text', () => {
      expect(getLicenseText(LICENSE_STATE.VALID)).toEqual(VALID_LICENSE_TEXT);
      expect(getLicenseText(LICENSE_STATE.INVALID)).toEqual(INVALID_LICENSE_TEXT);
      expect(getLicenseText(LICENSE_STATE.OUTDATED)).toEqual(OUTDATED_LICENSE_TEXT);
    });
  });

  describe('getFormElementType', () => {
    registerConstructor('text', TextField, 'field');
    registerConstructor('group', Group, 'group');
    registerConstructor('button', Button, 'button');

    it('returns the correct form element type for field, group, and button', () => {
      expect(getFormElementType('text')).toEqual(constructorTypes.field);
      expect(getFormElementType('group')).toEqual(constructorTypes.group);
      expect(getFormElementType('button')).toEqual(constructorTypes.button);
      expect(getFormElementType('unknown')).toBeNull();
    });
  });

  describe('extractFieldsFromSchema', () => {
    const mockSchema = [
      { id: 'field1', type: 'text' },
      {
        id: 'group1',
        type: 'group',
        schema: [
          { id: 'field2', type: 'text' },
          { id: 'field3', type: 'text' },
        ],
      },
    ];

    registerConstructor('text', TextField, 'field');

    it('correctly extracts field IDs from a schema', () => {
      const result = extractFieldsFromSchema(mockSchema);
      expect(result).toEqual(['field1', 'field2', 'field3']);
    });
  });

  describe('createWrapper', () => {
    it('creates and mounts a wrapper element', () => {
      document.body.innerHTML = '<div id="parent"></div>';
      const parent = document.getElementById('parent');
      const wrapper = createWrapper(parent as HTMLElement);
      expect(wrapper.parentNode).toBe(parent);
    });
  });

  describe('transformFieldName', () => {
    it('transforms field name according to list field notation', () => {
      const transformedName = transformFieldName('parent', '0', '.child');
      expect(transformedName).toBe('parent[0].child');
    });
  });

  describe('generateFieldSaveKey', () => {
    it('generates a unique save key for a field', () => {
      const saveKey = generateFieldSaveKey('formId', 'fieldId');
      expect(saveKey).toBe('__formsjs_formId_field_fieldId');
    });
  });

  describe('useLicensedFetures', () => {
    it('correctly sets if form uses licensed features', () => {
      expect(usesLicensedFetures()).toBeFalsy();
      useLicensedFetures();
      expect(usesLicensedFetures()).toBeTruthy();
    });
  });

  describe('handleInvalidLicenseLog', () => {
    global.console = {
      ...global.console,
      error: jest.fn(),
    };

    it('checks if invalid license logs error in console', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      handleInvalidLicenseLog(LICENSE_STATE.INVALID);
      expect(spy).toHaveBeenCalledWith(INVALID_CONSOLE_TEXT);
      spy.mockRestore();
      global.console = {
        ...global.console,
        error: console.error,
      };
    });

    it('checks if oudated license logs error in console', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      handleInvalidLicenseLog(LICENSE_STATE.OUTDATED);
      expect(spy).toHaveBeenCalledWith(OUTDATED_CONSOLE_TEXT);
      spy.mockRestore();
      global.console = {
        ...global.console,
        error: console.error,
      };
    });
  });

  describe('isJson function', () => {
    it('decides if string is JSON', () => {
      expect(isJson('string')).toBeFalsy();
      expect(isJson('true')).toBeTruthy();
      expect(isJson(JSON.stringify({
        iamobject: true
      }))).toBeTruthy();
    });

  });


  describe('Condition Parsing and Evaluation', () => {
    describe('parseConditionString', () => {
      it('parses condition strings into structured conditions', () => {
        const conditionStr = '[field1=value1]:true;[field2!=value2]:test';
        const parsed = parseConditionString(conditionStr);
        expect(parsed).toEqual([
          {
            conditions: [[{ left: 'field1', operator: '=', right: 'value1', isDate: false }]],
            returnValue: 'true',
          },
          {
            conditions: [[{ left: 'field2', operator: '!=', right: 'value2', isDate: false }]],
            returnValue: 'test',
          },
        ]);
      });

      it('throws error on unsupported conditions', () => {
        const conditionStr = '[field1!value1]:true;[field2!=value2]:test';
        expect(() => parseConditionString(conditionStr)).toThrowError();
      });

      it('handles date parsing correctly', () => {
        const dateStr = '2023-01-01';
        const conditionStr = `[dateField=date!${dateStr}]:true`;
        const parsed = parseConditionString(conditionStr);
        expect(parsed[0].conditions[0][0].right).toEqual(new Date(dateStr));
        expect(parsed[0].conditions[0][0].isDate).toBe(true);
      });
    });

    describe('evaluateParsedConditions', () => {
      it('evaluates conditions correctly and returns the corresponding value', () => {
        const parsedConditions: ParsedCondition[] = [
          {
            conditions: [[{ left: 'field1', operator: '=', right: 'value1', isDate: false }]],
            returnValue: 'true',
          },
        ];
        const formData = { field1: 'value1' };
        const result = evaluateParsedConditions(parsedConditions, formData);
        expect(result).toBe(true);
        const parsedConditionsString: ParsedCondition[] = [
          {
            conditions: [[{ left: 'field1', operator: '=', right: 'value1', isDate: false }]],
            returnValue: 'test',
          },
        ];
        const formDataString = { field1: 'value1' };
        const resultString = evaluateParsedConditions(parsedConditionsString, formDataString);
        expect(resultString).toBe('test');
      });

      it('returns default value if no conditions match', () => {
        const parsedConditions: ParsedCondition[] = [
          {
            conditions: [[{ left: 'field1', operator: '=', right: 'nonMatchingValue', isDate: false }]],
            returnValue: 'true',
          },
        ];
        const formData = { field1: 'value1' };
        const result = evaluateParsedConditions(parsedConditions, formData);
        expect(result).toBe(false); // Assuming default is false
      });

      it('handles complex conditions with AND/OR logic', () => {
        const parsedConditions: ParsedCondition[] = [
          {
            conditions: [
              [
                { left: 'field1', operator: '=', right: 'value1', isDate: false },
                { left: 'field2', operator: '!=', right: 'value2', isDate: false },
              ],
              [{ left: 'field3', operator: '>', right: 10, isDate: false }],
            ],
            returnValue: 'true',
          },
        ];
        const formData = { field1: 'value1', field2: 'value3', field3: 20 };
        const result = evaluateParsedConditions(parsedConditions, formData);
        expect(result).toBe(true);
      });
    });

    describe('compareValues function', () => {
      it('correctly evaluates equality', () => {
        expect(compareValues('=', 5, 5)).toBe(true);
        expect(compareValues('=', 'test', 'test')).toBe(true);
        expect(compareValues('=', 5, 3)).toBe(false);
      });

      it('correctly evaluates inequality', () => {
        expect(compareValues('!=', 5, 3)).toBe(true);
        expect(compareValues('!=', 'test', 'best')).toBe(true);
        expect(compareValues('!=', 5, 5)).toBe(false);
      });

      it('correctly evaluates greater than', () => {
        expect(compareValues('>', 5, 3)).toBe(true);
        expect(compareValues('>', 3, 5)).toBe(false);
        expect(compareValues('>', 5, 5)).toBe(false);
      });

      it('correctly evaluates less than', () => {
        expect(compareValues('<', 3, 5)).toBe(true);
        expect(compareValues('<', 5, 3)).toBe(false);
        expect(compareValues('<', 5, 5)).toBe(false);
      });

      it('correctly evaluates greater than or equal to', () => {
        expect(compareValues('>=', 5, 5)).toBe(true);
        expect(compareValues('>=', 5, 3)).toBe(true);
        expect(compareValues('>=', 3, 5)).toBe(false);
      });

      it('correctly evaluates less than or equal to', () => {
        expect(compareValues('<=', 5, 5)).toBe(true);
        expect(compareValues('<=', 3, 5)).toBe(true);
        expect(compareValues('<=', 5, 3)).toBe(false);
      });

      it('handles comparison with different data types', () => {
        expect(compareValues('=', '5', 5)).toBe(false);
        expect(compareValues('!=', '5', 5)).toBe(true);
      });
    });
  });
});
