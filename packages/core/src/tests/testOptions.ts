import { Form, FormOptions, Field } from '../index';

export const DEFAULT_STRING_VALUE = "foo";
export const DEFAULT_NUMBER_VALUE = 2;
export const DEFAULT_BOOL_VALUE = true;
export const FORM_ID = "test-form"

const validationFail = () => false;

export const baseFormOptions: FormOptions = {
    id: FORM_ID,
    schema: []
}

export const baseTextFieldTestOptions = {
    id: "test-text-field",
    name: "test-field-name",
    label: "Testing Field",
    type: "text",
    required: true,
    default: DEFAULT_STRING_VALUE,
    className: "text-field-class"
}

export function createForm() {
    const parent = document.createElement("div");
    parent.className = "test-form";
    const options: FormOptions = {
        ...baseFormOptions,
        schema: [
            baseTextFieldTestOptions,
        ]
    };
    const form = new Form(
        parent,
        options
    );
    return form;
}