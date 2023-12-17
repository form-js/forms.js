import { RatingField } from './ratingField';
import { costructorTypes, PluginSettings } from '@forms.js/core';

export const pluginSettings: PluginSettings = {
  type: 'rating',
  constructor: RatingField,
  constructorType: costructorTypes.field,
  licensed: true,
};
