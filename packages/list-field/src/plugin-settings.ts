import { costructorTypes } from '../node_modules/formsjs/lib/constants';
import { PluginSettings } from '../node_modules/formsjs/lib/types';
import { ListField } from './listField';

export const pluginSettings: PluginSettings = {
  type: 'list',
  constructor: ListField,
  constructorType: costructorTypes.field,
  licensed: true,
};
