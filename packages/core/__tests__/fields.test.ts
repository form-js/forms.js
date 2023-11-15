/*import {describe, expect, test} from '@jest/globals';
import { FormOptions } from '../src/interfaces';
import { Form } from './../lib/index';
import { FORM_ID, baseFormOptions, baseTextFieldTestOptions } from './testOptions';

describe('tests text field', () => {
    const parent = document.createElement("div");
    parent.className = "test-form";
    const options:FormOptions = {
        ...baseFormOptions,
        schema: [
            baseTextFieldTestOptions,
        ]
    };

    const form = new Form(
        "test-form",
        options
    );

    test('form created', () => {
      expect(form.getId()).toBe(FORM_ID);
    });
  });*/