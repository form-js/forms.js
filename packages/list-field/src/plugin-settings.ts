import { PluginSettings, constructorTypes } from '@forms.js/core';
import { ListField } from './listField';

export const pluginSettings: PluginSettings = {
  type: 'list',
  constructor: ListField,
  constructorType: constructorTypes.field,
  licensed: true,
};
