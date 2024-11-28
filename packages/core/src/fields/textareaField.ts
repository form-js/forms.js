import { Field } from '../Field';
import { TextAreaFieldConfig } from '../types';
import { maxLengthValidator, minLengthValidator } from '../validators/validators';
import { FieldTypes } from '../utils/enums';
import { RenderTextAreaField } from '../renderers/TextAreaFieldRenderer';

export class TextAreaField extends Field<string, TextAreaFieldConfig> {
  constructor(config: TextAreaFieldConfig) {
    super(config, RenderTextAreaField, FieldTypes.TextArea);
    if (config.useDefaultValidators !== false) {
      this.config$.validators?.push(minLengthValidator);
      this.config$.validators?.push(maxLengthValidator);
    }
  }
}
