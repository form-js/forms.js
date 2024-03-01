import { describe, expect, beforeEach, it, jest } from '@jest/globals';
import * as constants from './../constants';
import { usePlugin, PluginSettings, Form, GroupOptions } from './../index';

jest.mock('../constants', () => {
  const originalModule = jest.requireActual('../constants') as object;

  return {
    __esModule: true,
    ...originalModule,
    registerConstructor: jest.fn(),
    //useLicensedFetures: jest.fn(),
  };
});

class dummyConstructor {
  constructor(parent: HTMLElement, form: Form, options: GroupOptions) {}
}

describe('usePlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a single plugin setting', () => {
    const singleSetting: PluginSettings = {
      type: 'singleType',
      constructor: dummyConstructor,
      constructorType: 'singleConstructorType',
      licensed: true,
    };

    usePlugin(singleSetting);

    expect(constants.registerConstructor).toHaveBeenCalledWith(
      singleSetting.type,
      singleSetting.constructor,
      singleSetting.constructorType,
      singleSetting.licensed,
    );
  });

  it('registers multiple plugin settings', () => {
    const settingsArray = [
      {
        type: 'firstType',
        constructor: dummyConstructor,
        constructorType: 'firstConstructorType',
        licensed: true,
      },
      {
        type: 'secondType',
        constructor: dummyConstructor,
        constructorType: 'secondConstructorType',
        licensed: false,
      },
    ];

    usePlugin(settingsArray);

    settingsArray.forEach((setting) => {
      expect(constants.registerConstructor).toHaveBeenCalledWith(
        setting.type,
        setting.constructor,
        setting.constructorType,
        setting.licensed,
      );
    });
  });

  it('uses false as default value for licensed if not provided', () => {
    const settingWithoutLicensed = {
      type: 'noLicenseType',
      constructor: dummyConstructor,
      constructorType: 'noLicenseConstructorType',
    };

    usePlugin(settingWithoutLicensed);

    expect(constants.registerConstructor).toHaveBeenCalledWith(
      settingWithoutLicensed.type,
      settingWithoutLicensed.constructor,
      settingWithoutLicensed.constructorType,
      false,
    );
  });
});
