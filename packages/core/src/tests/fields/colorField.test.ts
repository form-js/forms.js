import { ColorField } from './../../fields/colorField';
import { describe, expect, it, jest } from '@jest/globals';
import { createForm, baseColorFieldTestOptions, COLOR_FIELD_ID, DEFAULT_COLOR_VALUE } from './../test.options';
import * as utils from '../../utils';

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

describe('color-field', () => {
    it('gets field value', () => {
        const form = createForm({
            schema: [
                {
                    ...baseColorFieldTestOptions,
                },
            ],
        });

        const field = form.getField(COLOR_FIELD_ID)! as unknown as ColorField;
        expect(field.getValue()).toBe(DEFAULT_COLOR_VALUE);
        expect(field.getId()).toBe(COLOR_FIELD_ID);
        expect(field.getSaveKey()).toBe(utils.generateFieldSaveKey(form.getId(), COLOR_FIELD_ID));
        expect(field.getType()).toBe('color');
        expect(field.getVisibility()).toBeTruthy();
        expect(field.getForm()).toBe(form);
    });

    it('input triggers change event', () => {
        const mockChange = jest.fn();
        const form = createForm({
            schema: [
                {
                    ...baseColorFieldTestOptions,
                    default: false,
                    change: mockChange,
                }
            ]
        });
        const field = form.getField(COLOR_FIELD_ID)! as unknown as ColorField;
        const element = form.getFormElement()!.querySelector('#' + field.getId());
        expect(element).not.toBeNull();
        const event = new Event('change');
        element!.dispatchEvent(event);
        expect(mockChange).toHaveBeenCalled();
    });

    it('input uses validate function', () => {
        const form = createForm({
            schema: [
                {
                    ...baseColorFieldTestOptions,
                    required: true,
                    default: null,
                }
            ]
        });
        const field = form.getField(COLOR_FIELD_ID)! as unknown as ColorField;
        field.validate();
        expect(field.getValidity()).toBeFalsy();
    });
});