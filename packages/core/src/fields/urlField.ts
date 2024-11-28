import { RenderTextField } from '../renderers/TextFieldRenderer';
import { Field } from '../Field';
import { TextFieldConfig } from '../types';
import { maxLengthValidator, minLengthValidator, urlValidator } from '../validators/validators';
import { FieldTypes } from '../utils/enums';

export class UrlField extends Field<string, TextFieldConfig> {
  constructor(config: TextFieldConfig) {
    super(config, RenderTextField, FieldTypes.URL);
    if (config.useDefaultValidators !== false) {
      this.config$.validators?.push(minLengthValidator);
      this.config$.validators?.push(maxLengthValidator);
      this.config$.validators?.push(urlValidator);
    }
  }
}
