import { DaterangeField } from './daterangeField';
import { constructorTypes, PluginSettings } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'daterange',
  constructor: DaterangeField,
  constructorType: constructorTypes.field,
  licensed: true,
};
