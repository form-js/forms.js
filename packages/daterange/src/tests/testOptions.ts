import { pluginSettings } from './../plugin-settings';
import { Form, FormOptions, usePlugin } from "@forms.js/core";

usePlugin(pluginSettings);

export const FORM_ID = 'testForm';
export const FIELD_ID = 'daterangeField';
export const DEFAULT_VALUE = '2024-05-07 to 2024-05-25';

export const baseFormOptions: FormOptions = {
    id: FORM_ID,
    schema: [],
};

export function createForm(opt?: Record<string, any>) {
    const parent = document.createElement('div');
    document.body.append(parent);
    parent.className = FORM_ID;
    parent.id = FORM_ID;
    const options: FormOptions = {
        ...baseFormOptions,
        schema: [],
        ...opt,
    };
    const form = new Form(parent, options);
    return form;
}

export const baseDateRangeFieldTestOptions = {
    id: FIELD_ID,
    name: 'test-date',
    label: 'Testing Field',
    type: 'daterange',
    default: DEFAULT_VALUE,
    className: 'date-field-class',
    placeholder: 'date-placeholder',
  };