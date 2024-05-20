import { RichtextField } from './richtextField';
import { PluginSettings, constructorTypes } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'richtext',
  constructor: RichtextField,
  constructorType: constructorTypes.field,
  licensed: true,
};
