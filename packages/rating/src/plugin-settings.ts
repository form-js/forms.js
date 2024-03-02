import { RatingField } from './ratingField';
import { constructorTypes, PluginSettings } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'rating',
  constructor: RatingField,
  constructorType: constructorTypes.field,
  licensed: true,
};
