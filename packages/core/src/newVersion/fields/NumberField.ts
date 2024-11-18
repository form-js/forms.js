import { RenderNumberField } from '../renderers/NumberFieldRenderer';
import { Field } from '../Field';
import { TextFieldConfig } from '../types';

export class NumberField extends Field<string, TextFieldConfig> {
  constructor(config: TextFieldConfig) {
    super(config, RenderNumberField);
  }

  get maxLength(): number | null {
    return this.config.maxLength ?? null;
  }
}
