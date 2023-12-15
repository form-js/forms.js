import { DaterangeField } from './daterangeField';
import { costructorTypes, PluginSettings } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'daterange',
  constructor: DaterangeField,
  constructorType: costructorTypes.field,
  licensed: true,
};
