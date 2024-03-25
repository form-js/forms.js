import { describe, expect, test, afterEach, it, jest } from '@jest/globals';
import * as constantsFile from '../constants';
import { useLicensedFetures } from '../utils';
import { pluginConstructor } from '../types';

// Mock the useLicensedFetures function
jest.mock('../utils', () => ({
  useLicensedFetures: jest.fn(),
}));

describe('constants and registerConstructor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('defines expected constants', () => {
    expect(constantsFile.PACKAGE_LICENSE_URL).toBeDefined();
    expect(constantsFile.licensePlateClass).toBeDefined();
    expect(constantsFile.licensePlateStyle).toBeDefined();
    expect(constantsFile.fields).toEqual(expect.any(Array));
    expect(constantsFile.groups).toEqual(expect.any(Array));
    expect(constantsFile.buttons).toEqual(expect.any(Array));
    expect(constantsFile.formElements).toEqual(expect.any(Array));
    expect(constantsFile.constructorTypes).toEqual({
      field: 'field',
      group: 'group',
      button: 'button',
    });
    expect(constantsFile.OS_LICENSE_KEYS).toContain('GPL-My-Project-Is-Open-Source');
    expect(constantsFile.UPGRADE_WINDOW).toEqual(372);
    expect(constantsFile.LICENSE_STATE).toEqual({
      VALID: 1,
      OUTDATED: 2,
      INVALID: 3,
    });
  });

  describe('registerConstructor', () => {
    const mockConstructor: pluginConstructor = jest.fn();

    it('registers a new field constructor', () => {
      constantsFile.registerConstructor('testField', mockConstructor, constantsFile.constructorTypes.field);
      expect(constantsFile.fields).toContain('testField');
      expect(constantsFile.elementConstructors['testField']).toBe(mockConstructor);
      expect(useLicensedFetures).not.toHaveBeenCalled();
    });

    it('registers a new group constructor', () => {
      constantsFile.registerConstructor('testGroup', mockConstructor, constantsFile.constructorTypes.group);
      expect(constantsFile.groups).toContain('testGroup');
      expect(constantsFile.elementConstructors['testGroup']).toBe(mockConstructor);
    });

    it('registers a new button constructor with licensing', () => {
      constantsFile.registerConstructor('testButton', mockConstructor, constantsFile.constructorTypes.button, true);
      expect(constantsFile.buttons).toContain('testButton');
      expect(constantsFile.elementConstructors['testButton']).toBe(mockConstructor);
      expect(useLicensedFetures).toHaveBeenCalled();
    });
  });
});
