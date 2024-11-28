import { Field } from '../Field';
import { FileFieldConfig } from '../types';
import { FieldTypes } from '../utils/enums';
import { RenderFileField } from '../renderers/FileFieldRenderer';

export class FileField extends Field<FileList | null, FileFieldConfig> {
  constructor(config: FileFieldConfig) {
    super(config, RenderFileField, FieldTypes.File);
  }
}
