import { Tabs } from './tabs';
import { PluginSettings, costructorTypes } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'tabs',
  constructor: Tabs,
  constructorType: costructorTypes.group,
  licensed: true,
};
