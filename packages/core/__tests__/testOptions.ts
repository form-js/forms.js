import { FormOptions } from "../src/interfaces";

export const DEFAULT_STRING_VALUE = "foo";
export const DEFAULT_NUMBER_VALUE = 2;
export const DEFAULT_BOOL_VALUE = true;
export const FORM_ID = "test-form"

export const baseFormOptions:FormOptions = {
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