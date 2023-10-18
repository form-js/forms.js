import { RitchtextField } from './ritchtextField';
import { costructorTypes } from '../node_modules/formsjs/lib/constants';
import { PluginSettings } from '../node_modules/formsjs/lib/types';

export const pluginSettings: PluginSettings = {
  type: 'daterange',
  constructor: RitchtextField,
  constructorType: costructorTypes.field,
  licensed: true,
};
