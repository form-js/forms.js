import { RenderTextField } from '../renderers/TextFieldRenderer';
import { Field } from '../Field';
import { TextFieldConfig } from '../types';
import { maxLengthValidator, minLengthValidator } from '../validators/validators';

export class TextField extends Field<string, TextFieldConfig> {
  constructor(config: TextFieldConfig) {
    super(config, RenderTextField);
    if (config.useDefaultValidators !== false) {
      this.config$.validators?.push(minLengthValidator);
      this.config$.validators?.push(maxLengthValidator);
    }
  }
}
