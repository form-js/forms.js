import { describe, expect, test, afterAll, beforeEach, afterEach, it, jest } from '@jest/globals';
import { Button } from './../button';
import * as utils from './../utils';
import { BUTTON_ID, FORM_ID, createForm } from './test.options';
import { Form } from '../form';
import { ButtonOptions } from '../interfaces';
import { FormElement } from '../types';

jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils') as object;

  return {
    __esModule: true,
    ...originalModule,
    mountElement: jest.fn(),
    unmountElement: jest.fn(),
    evaluateParsedConditions: jest.fn(),
    parseConditionString: jest.fn(),
  };
});

describe('Button', () => {
  let parentElement: HTMLElement;
  let form: Form;
  let buttonOptions: ButtonOptions;
  let button: Button;

  beforeEach(() => {
    buttonOptions = {
      id: BUTTON_ID,
      type: 'button',
      buttonType: 'submit',
      className: 'btn',
      template: 'Submit',
      conditions: 'visibleCondition',
    };
    form = createForm({
      schema: [
        {
          ...buttonOptions,
        },
      ],
    });

    parentElement = document.createElement('div');
    button = form.getButton(BUTTON_ID) as unknown as Button;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('initializes with default options', () => {
    expect(button.getId()).toBe(buttonOptions.id);
    expect(button.getType()).toBe(buttonOptions.type);
    expect(button.getButtonType()).toBe(buttonOptions.buttonType);
    expect(button.getContainer()).toBeTruthy();
  });

  it('creates container and button elements', () => {
    expect(button.containerElement).toBeDefined();
    expect(button.buttonElement).toBeDefined();
    expect(button.containerElement?.className).toBe('form-button-container');
    expect(button.buttonElement?.innerHTML).toBe(buttonOptions.template);
  });

  it('handles button click events', () => {
    const clickSpy = jest.fn();
    buttonOptions.click = clickSpy;
    button = new Button(parentElement, form, buttonOptions);
    button.buttonElement?.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('parses string conditions correctly', () => {
    (utils.parseConditionString as jest.Mock).mockReturnValue([{ conditions: [], returnValue: true }]);
    button.initialize();
    expect(utils.parseConditionString).toHaveBeenCalledWith(buttonOptions.conditions);
  });

  it('updates visibility based on conditions', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    button.update();
    expect(button.getVisibility()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    button.update();
    expect(button.getVisibility()).toBe(false);
  });

  it('destroys button, removing it from the DOM', () => {
    button.destroy();
    expect(utils.unmountElement).toHaveBeenCalledWith(parentElement);
  });

  //Expand test further
});
