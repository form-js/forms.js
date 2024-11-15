import { Field } from '../Field';
import { BaseInputTypes } from '../utils/enums';
import { renderInputField } from './baseInputRenderer';

export function numberFieldRenderer(container: HTMLElement, field: Field) {
  return renderInputField(container, field, BaseInputTypes.Number);
}
