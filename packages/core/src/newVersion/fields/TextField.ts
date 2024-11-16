import { RenderTextField } from '../renderers/TextFieldRenderer';
import { Field } from '../Field';
import { TextFieldConfig } from '../types/interfaces';

export class TextField extends Field<string, TextFieldConfig> {
  constructor(config: TextFieldConfig) {
    super(config, RenderTextField);
  }

  get maxLength(): number | null {
    return this.config.maxLength ?? null;
  }
}
