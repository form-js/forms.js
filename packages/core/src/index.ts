import { RadioField } from './fields/radioField';
import { DatetimeField } from './fields/datetimeField';
import { Button } from './button';
import { constructorTypes, registerConstructor } from './constants';
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

registerConstructor('group', Group, constructorTypes.group);
registerConstructor('button', Button, constructorTypes.button);
registerConstructor('checkbox', CheckboxField, constructorTypes.field);
registerConstructor('color', ColorField, constructorTypes.field);
registerConstructor('date', DateField, constructorTypes.field);
registerConstructor('datetime', DatetimeField, constructorTypes.field);
registerConstructor('email', EmailField, constructorTypes.field);
registerConstructor('file', FileField, constructorTypes.field);
registerConstructor('hidden', HiddenField, constructorTypes.field);
registerConstructor('number', NumberField, constructorTypes.field);
registerConstructor('password', PasswordField, constructorTypes.field);
registerConstructor('radio', RadioField, constructorTypes.field);
registerConstructor('range', RangeField, constructorTypes.field);
registerConstructor('select', SelectField, constructorTypes.field);
registerConstructor('static', StaticField, constructorTypes.field);
registerConstructor('tel', TelField, constructorTypes.field);
registerConstructor('textarea', TextareaField, constructorTypes.field);
registerConstructor('text', TextField, constructorTypes.field);
registerConstructor('time', TimeField, constructorTypes.field);
registerConstructor('url', UrlField, constructorTypes.field);
registerConstructor('week', WeekField, constructorTypes.field);

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
