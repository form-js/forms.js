import { describe, expect, it } from '@jest/globals';
import * as ModuleExports from './../index';

describe('Module Exports', () => {
  const expectedExports = [
    'usePlugin',
    'Form',
    'Button',
    'setLicenseKey',
    'mountElement',
    'unmountElement',
    'extractFieldsFromSchema',
    'useLicensedFetures',
    'generateFieldSaveKey',
    'Field',
    'fields',
    'buttons',
    'groups',
    'constructorTypes',
    'evaluateParsedConditions',
    'parseConditionString',
  ];

  expectedExports.forEach((exportKey) => {
    it(`exports ${exportKey}`, () => {
      expect(ModuleExports).toHaveProperty(exportKey);
    });
  });
});
