import { describe, expect, test, jest } from '@jest/globals';
import { Form, FormOptions, Field } from '../src/index';
import { FORM_ID, baseFormOptions, baseTextFieldTestOptions } from './testOptions';

jest.mock('../src/field');

describe('tests text field', () => {
    /**
     * @jest-environment jsdom
     */

    test('create form', () => {
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
        expect(form.getId()).toBe(FORM_ID);
    });

    test('two plus two is four', () => {
        expect(2 + 2).toBe(4);
    });
});