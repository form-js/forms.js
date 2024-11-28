import { RenderNumberField } from '../renderers/NumberFieldRenderer';
import { Field } from '../Field';
import { NumberFieldConfig, TextFieldConfig } from '../types';
import { maxValidator, minValidator } from '../validators/validators';

export class NumberField extends Field<number, NumberFieldConfig> {
  constructor(config: NumberFieldConfig) {
    super(config, RenderNumberField);
    if (config.useDefaultValidators !== false) {
      this.config$.validators?.push(minValidator);
      this.config$.validators?.push(maxValidator);
    }
  }
}
