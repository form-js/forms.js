import { PluginSettings, costructorTypes } from '@forms.js/core';
import { ListField } from './listField';

export const pluginSettings: PluginSettings = {
  type: 'list',
  constructor: ListField,
  constructorType: costructorTypes.field,
  licensed: true,
};
