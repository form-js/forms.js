import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseEmailFieldTestOptions, EMAIL_FIELD_ID, DEFAULT_EMAIL_VALUE, INVALID_EMAIL_VALUE } from './../test.options';
import * as utils from '../../utils';
import { EmailField } from '../../fields';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as object;

    return {
        __esModule: true,
        ...originalModule,
        evaluateParsedConditions: jest.fn(),
        parseConditionString: jest.fn(),
        usesLicensedFetures: jest.fn(),
        processLicenseKey: jest.fn(),
    };
});

describe('email-field', () => {
    it('gets field value', () => {
        const form = createForm({
            schema: [
                {
                    ...baseEmailFieldTestOptions,
                },
            ],
        });

        const field = form.getField(EMAIL_FIELD_ID)! as unknown as EmailField;
        expect(field.getValue()).toBe(DEFAULT_EMAIL_VALUE);
        expect(field.getId()).toBe(EMAIL_FIELD_ID);
        expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), EMAIL_FIELD_ID));
        expect(field.getType()).toBe('email');
        expect(field.getVisibility()).toBeTruthy();
        expect(field.getForm()).toBe(form);
    });

    it('input uses validate function', () => {
        const form = createForm({
            schema: [
                {
                    ...baseEmailFieldTestOptions,
                    required: true,
                    default: null,
                }
            ]
        });
        const field = form.getField(EMAIL_FIELD_ID)! as unknown as EmailField;
        field.validate();
        expect(field.getValidity()).toBeFalsy();
    });

    it('input uses validate function and detects invalid email', () => {
        const form = createForm({
            schema: [
                {
                    ...baseEmailFieldTestOptions,
                    required: true,
                    default: INVALID_EMAIL_VALUE,
                }
            ]
        });
        const field = form.getField(EMAIL_FIELD_ID)! as unknown as EmailField;
        field.validate();
        expect(field.getValidity()).toBeFalsy();
    });

    it('input passes validation with valid email', () => {
        const form = createForm({
            schema: [
                {
                    ...baseEmailFieldTestOptions,
                    required: true,
                    default: DEFAULT_EMAIL_VALUE,
                }
            ]
        });
        const field = form.getField(EMAIL_FIELD_ID)! as unknown as EmailField;
        field.validate();
        expect(field.getValidity()).toBeTruthy();
    });
});