import { RadioField } from './fields/radioField';
import { DatetimeField } from './fields/datetimeField';
import { Button } from './button';
import {
  BUTTON_TYPE_BUTTON,
  FIELD_TYPE_CHECKBOX,
  FIELD_TYPE_COLOR,
  FIELD_TYPE_DATE,
  FIELD_TYPE_DATETIME,
  FIELD_TYPE_EMAIL,
  FIELD_TYPE_FILE,
  GROUP_TYPE_GROUP,
  FIELD_TYPE_HIDDEN,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_PASSWORD,
  FIELD_TYPE_RADIO,
  FIELD_TYPE_RANGE,
  FIELD_TYPE_SELECT,
  FIELD_TYPE_STATIC,
  FIELD_TYPE_TEL,
  FIELD_TYPE_TEXT,
  FIELD_TYPE_TEXTAREA,
  FIELD_TYPE_TIME,
  FIELD_TYPE_URL,
  FIELD_TYPE_WEEK,
  constructorTypes,
  registerConstructor,
} from './constants';
import {
  CheckboxField,
  ColorField,
  DateField,
  EmailField,
  FileField,
  HiddenField,
  NumberField,
  PasswordField,
  RangeField,
  SelectField,
  StaticField,
  TelField,
  TextField,
  TextareaField,
  TimeField,
  UrlField,
  WeekField,
} from './fields/index';
import { Group } from './group';
import { PluginSettings } from './types';

registerConstructor(GROUP_TYPE_GROUP, Group, constructorTypes.group);
registerConstructor(BUTTON_TYPE_BUTTON, Button, constructorTypes.button);
registerConstructor(FIELD_TYPE_CHECKBOX, CheckboxField, constructorTypes.field);
registerConstructor(FIELD_TYPE_COLOR, ColorField, constructorTypes.field);
registerConstructor(FIELD_TYPE_DATE, DateField, constructorTypes.field);
registerConstructor(FIELD_TYPE_DATETIME, DatetimeField, constructorTypes.field);
registerConstructor(FIELD_TYPE_EMAIL, EmailField, constructorTypes.field);
registerConstructor(FIELD_TYPE_FILE, FileField, constructorTypes.field);
registerConstructor(FIELD_TYPE_HIDDEN, HiddenField, constructorTypes.field);
registerConstructor(FIELD_TYPE_NUMBER, NumberField, constructorTypes.field);
registerConstructor(FIELD_TYPE_PASSWORD, PasswordField, constructorTypes.field);
registerConstructor(FIELD_TYPE_RADIO, RadioField, constructorTypes.field);
registerConstructor(FIELD_TYPE_RANGE, RangeField, constructorTypes.field);
registerConstructor(FIELD_TYPE_SELECT, SelectField, constructorTypes.field);
registerConstructor(FIELD_TYPE_STATIC, StaticField, constructorTypes.field);
registerConstructor(FIELD_TYPE_TEL, TelField, constructorTypes.field);
registerConstructor(FIELD_TYPE_TEXTAREA, TextareaField, constructorTypes.field);
registerConstructor(FIELD_TYPE_TEXT, TextField, constructorTypes.field);
registerConstructor(FIELD_TYPE_TIME, TimeField, constructorTypes.field);
registerConstructor(FIELD_TYPE_URL, UrlField, constructorTypes.field);
registerConstructor(FIELD_TYPE_WEEK, WeekField, constructorTypes.field);

export const usePlugin = (settings: PluginSettings | PluginSettings[]) => {
  if (Array.isArray(settings)) {
    settings.forEach((s: PluginSettings) => {
      registerConstructor(s.type, s.constructor, s.constructorType, s.licensed ?? false);
    });
  } else {
    registerConstructor(settings.type, settings.constructor, settings.constructorType, settings.licensed ?? false);
  }
};

export { Form } from './form';
export { Button } from './button';
export { ButtonOptions, FieldOptions, FormOptions, GroupOptions } from './interfaces';
export {
  setLicenseKey,
  mountElement,
  unmountElement,
  extractFieldsFromSchema,
  useLicensedFetures,
  generateFieldSaveKey,
} from './utils';
export { Field } from './field';
export { fields, buttons, groups, constructorTypes, registerConstructor } from './constants';
export { Schema, FormData, FieldValue, PluginSettings, ParsedCondition, FormElement } from './types';
export { evaluateParsedConditions, parseConditionString } from './utils';
