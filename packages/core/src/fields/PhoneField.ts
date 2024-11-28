import { RenderTextField } from '../renderers/TextFieldRenderer';
import { Field } from '../Field';
import { TextFieldConfig } from '../types';
import { maxLengthValidator, minLengthValidator, phoneValidator } from '../validators/validators';
import { FieldTypes } from '../utils/enums';

export class PhoneField extends Field<string, TextFieldConfig> {
  constructor(config: TextFieldConfig) {
    super(config, RenderTextField, FieldTypes.Phone);
    if (config.useDefaultValidators !== false) {
      this.config$.validators?.push(minLengthValidator);
      this.config$.validators?.push(maxLengthValidator);
      this.config$.validators?.push(phoneValidator);
    }
  }
}
