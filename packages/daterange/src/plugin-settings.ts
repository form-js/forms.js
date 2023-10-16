import { DaterangeField } from './daterangeField';
import { costructorTypes } from '../node_modules/formsjs/lib/constants';
import { PluginSettings } from '../node_modules/formsjs/lib/types';

export const pluginSettings: PluginSettings = {
  type: 'daterange',
  constructor: DaterangeField,
  constructorType: costructorTypes.field,
  licensed: true,
};
