import { Field } from '../Field';
import { BaseInputTypes } from '../utils/enums';
import { renderInputField } from './baseInputRenderer';

export function textFieldRenderer(container: HTMLElement, field: Field<string>) {
  return renderInputField(container, field, BaseInputTypes.Text);
}
