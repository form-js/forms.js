import { Field } from '../Field';
import { DateFieldConfig } from '../types';
import { RenderDateField } from '../renderers/DateFieldRenderer';

export class WeekField extends Field<string, DateFieldConfig> {
  constructor(config: DateFieldConfig) {
    super(config, RenderDateField);
  }
}
