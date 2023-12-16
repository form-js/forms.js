import { RitchtextField } from './ritchtextField';
import { PluginSettings, costructorTypes } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'daterange',
  constructor: RitchtextField,
  constructorType: costructorTypes.field,
  licensed: true,
};
