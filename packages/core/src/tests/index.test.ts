import { describe, expect, beforeEach, it, jest } from '@jest/globals';
import * as constants from './../constants';
import { usePlugin, PluginSettings, Form, GroupOptions, constructorTypes } from './../index';

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
  constructor(parent: HTMLElement, form: Form, options: GroupOptions) { }
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
      type: 'dummy',
      constructor: dummyConstructor,
      constructorType: constructorTypes.group,
    };

    usePlugin(settingWithoutLicensed);

    expect(constants.registerConstructor).toHaveBeenCalledWith(
      settingWithoutLicensed.type,
      settingWithoutLicensed.constructor,
      settingWithoutLicensed.constructorType,
      false,
    );
  });

  it('defines and exports constants', () => { 
    expect(constants.GROUP_TYPE_GROUP).toBe('group');
    expect(constants.BUTTON_TYPE_BUTTON).toBe('button');
    expect(constants.FIELD_TYPE_CHECKBOX).toBe('checkbox');
    expect(constants.FIELD_TYPE_COLOR).toBe('color');
    expect(constants.FIELD_TYPE_DATE).toBe('date');
    expect(constants.FIELD_TYPE_DATETIME).toBe('datetime');
    expect(constants.FIELD_TYPE_EMAIL).toBe('email');
    expect(constants.FIELD_TYPE_FILE).toBe('file');
    expect(constants.FIELD_TYPE_HIDDEN).toBe('hidden');
    expect(constants.FIELD_TYPE_NUMBER).toBe('number');
    expect(constants.FIELD_TYPE_PASSWORD).toBe('password');
    expect(constants.FIELD_TYPE_RADIO).toBe('radio');
    expect(constants.FIELD_TYPE_RANGE).toBe('range');
    expect(constants.FIELD_TYPE_SELECT).toBe('select');
    expect(constants.FIELD_TYPE_STATIC).toBe('static');
    expect(constants.FIELD_TYPE_TEL).toBe('tel');
    expect(constants.FIELD_TYPE_TEXTAREA).toBe('textarea');
    expect(constants.FIELD_TYPE_TEXT).toBe('text');
    expect(constants.FIELD_TYPE_TIME).toBe('time');
    expect(constants.FIELD_TYPE_URL).toBe('url');
    expect(constants.FIELD_TYPE_WEEK).toBe('week');
    expect(constants.FIELD_TYPE_DATERANGE).toBe('daterange');
  });
});
