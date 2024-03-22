import { Tabs } from './tabs';
import { PluginSettings, constructorTypes } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'tabs',
  constructor: Tabs,
  constructorType: constructorTypes.group,
  licensed: true,
};
