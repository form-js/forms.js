import { DaterangeField } from './daterangeField';
import { constructorTypes, FIELD_TYPE_DATERANGE, PluginSettings } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: FIELD_TYPE_DATERANGE,
  constructor: DaterangeField,
  constructorType: constructorTypes.field,
  licensed: true,
};
