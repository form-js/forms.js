import { describe, expect, test, it, jest, afterEach } from '@jest/globals';
import { Button } from '../button';
import { TextField } from '../fields';
import { Group } from '../group';
import { ParsedCondition } from '../types';
import { LICENSE_STATE, costructorTypes, registerConstructor } from './../constants';
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
} from './../utils';

describe('formUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('debounce', () => {
    jest.useFakeTimers();
    it('should debounce a function call', () => {
      const callback = jest.fn();
      const debouncedFunc = debounce(callback, 1000, null);
      debouncedFunc();
      jest.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
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
      const obj = { key: 'value', nested: { nestedKey: 'nestedValue' } };
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
    it('should return the correct license state', () => {
      setLicenseKey('invalidLicenseKey');
      expect(processLicenseKey()).toEqual(LICENSE_STATE.INVALID);
    });
  });

  describe('getFormElementType', () => {
    registerConstructor('text', TextField, 'field');
    registerConstructor('group', Group, 'group');
    registerConstructor('button', Button, 'button');

    it('returns the correct form element type for field, group, and button', () => {
      expect(getFormElementType('text')).toEqual(costructorTypes.field);
      expect(getFormElementType('group')).toEqual(costructorTypes.group);
      expect(getFormElementType('button')).toEqual(costructorTypes.button);
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

  describe('parseConditionString', () => {
    const conditionStr = "[_value!=null&&_value!='']:true;[_required=true]:false";

    it('parses condition strings into structured conditions', () => {
      const parsedConditions = parseConditionString(conditionStr);
      expect(parsedConditions.length).toBe(2);
      expect(parsedConditions[0].conditions.length).toBe(2);
      expect(parsedConditions[0].conditions[0].length).toBe(1);
      expect(parsedConditions[0].returnValue).toBe('true');
      expect(parsedConditions[1].returnValue).toBe('false');
    });
  });

  describe('evaluateParsedConditions', () => {
    const parsedConditions: ParsedCondition[] = [
      { conditions: [[{ left: '_value', operator: '!=', right: null }]], returnValue: 'true' },
      { conditions: [[{ left: '_required', operator: '=', right: true }]], returnValue: 'false' },
    ];

    it('evaluates conditions correctly and returns the corresponding value', () => {
      const resultTrue = evaluateParsedConditions(parsedConditions, {}, 'not null');
      expect(resultTrue).toBe(true);

      const resultFalse = evaluateParsedConditions(parsedConditions, { _required: true });
      expect(resultFalse).toBe(false);
    });
  });
});
