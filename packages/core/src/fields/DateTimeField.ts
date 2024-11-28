import { Field } from '../Field';
import { DateFieldConfig } from '../types';
import { dateRangeValidator } from '../validators/validators';
import { RenderDateField } from '../renderers/DateFieldRenderer';
import { FieldTypes } from '../utils/enums';

export class DateTimeField extends Field<string, DateFieldConfig> {
  constructor(config: DateFieldConfig) {
    super(config, RenderDateField, FieldTypes.DateTime);
    if (config.useDefaultValidators !== false) {
      this.config$.validators?.push(dateRangeValidator);
    }
  }
}
