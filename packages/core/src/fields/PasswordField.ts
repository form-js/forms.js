import { Field } from '../Field';
import { PasswordFieldConfig } from '../types';
import { FieldTypes } from '../utils/enums';
import { RenderPasswordField } from '../renderers/PasswordFieldRenderer';

export class PasswordField extends Field<string, PasswordFieldConfig> {
  constructor(config: PasswordFieldConfig) {
    super(config, RenderPasswordField, FieldTypes.Password);
  }
}
