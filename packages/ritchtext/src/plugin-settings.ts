import { RitchtextField } from './ritchtextField';
import { PluginSettings, constructorTypes } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'daterange',
  constructor: RitchtextField,
  constructorType: constructorTypes.field,
  licensed: true,
};
