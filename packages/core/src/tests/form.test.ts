import { describe, expect, test, jest } from '@jest/globals';
import { DEFAULT_STRING_VALUE, FORM_ID, createForm } from './testOptions';

describe('test form class', () => {
    test('form getId', () => {
        const form = createForm();
        expect(form.getId()).toBe(FORM_ID);
    });
    test('form getData', () => {
        const form = createForm();
        expect(form.getData()).toMatchObject({'test-text-field': DEFAULT_STRING_VALUE});
    });
});