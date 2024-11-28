import { Field } from '../Field';
import { DateFieldConfig } from '../types';
import { dateRangeValidator } from '../validators/validators';
import { RenderDateField } from '../renderers/DateFieldRenderer';

export class DateField extends Field<string, DateFieldConfig> {
  constructor(config: DateFieldConfig) {
    super(config, RenderDateField);
    if (config.useDefaultValidators !== false) {
      this.config$.validators?.push(dateRangeValidator);
    }
  }
}
