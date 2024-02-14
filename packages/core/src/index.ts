import { RadioField } from './fields/radioField';
import { DatetimeField } from './fields/datetimeField';
import { Button } from './button';
import { costructorTypes, registerConstructor } from './constants';
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
} from './fields';
import { Group } from './group';
import { PluginSettings } from './types.js';

registerConstructor('group', Group, costructorTypes.group);
registerConstructor('button', Button, costructorTypes.button);
registerConstructor('checkbox', CheckboxField, costructorTypes.field);
registerConstructor('color', ColorField, costructorTypes.field);
registerConstructor('date', DateField, costructorTypes.field);
registerConstructor('datetime', DatetimeField, costructorTypes.field);
registerConstructor('email', EmailField, costructorTypes.field);
registerConstructor('file', FileField, costructorTypes.field);
registerConstructor('hidden', HiddenField, costructorTypes.field);
registerConstructor('number', NumberField, costructorTypes.field);
registerConstructor('password', PasswordField, costructorTypes.field);
registerConstructor('radio', RadioField, costructorTypes.field);
registerConstructor('range', RangeField, costructorTypes.field);
registerConstructor('select', SelectField, costructorTypes.field);
registerConstructor('static', StaticField, costructorTypes.field);
registerConstructor('tel', TelField, costructorTypes.field);
registerConstructor('textarea', TextareaField, costructorTypes.field);
registerConstructor('text', TextField, costructorTypes.field);
registerConstructor('time', TimeField, costructorTypes.field);
registerConstructor('url', UrlField, costructorTypes.field);
registerConstructor('week', WeekField, costructorTypes.field);

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
export { Button } from './button.js';
export { ButtonOptions, FieldOptions, FormOptions, GroupOptions } from './interfaces.js';
export {
  setLicenseKey,
  mountElement,
  unmountElement,
  extractFieldsFromSchema,
  useLicensedFetures,
  generateFieldSaveKey,
} from './utils.js';
export { Field } from './field.js';
export { fields, buttons, groups, costructorTypes } from './constants.js';
export { Schema, FormData, FieldValue, PluginSettings, ParsedCondition } from './types.js';
export { evaluateParsedConditions, parseConditionString } from './utils.js';
