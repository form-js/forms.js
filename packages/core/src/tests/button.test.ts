import { describe, expect, test, afterAll, beforeEach, afterEach, it, jest } from '@jest/globals';
import { Button } from './../button';
import * as utils from './../utils';
import { BUTTON_ID, createForm } from './test.options';
import { Form } from '../form';
import { ButtonOptions } from '../interfaces';
import { BUTTON_TYPE_BUTTON, ButtonEvents, DIV_ELEMENT } from '../constants';

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
      type: BUTTON_TYPE_BUTTON,
      buttonType: 'submit',
      className: 'btn',
      template: 'Submit',
      conditions: 'stringConditions',
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
    expect(button.buttonElement?.innerText).toBe(buttonOptions.template);
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

  it('updates visibility based on conditions function', () => {
    const mockConditions = jest.fn();
    buttonOptions.conditions = mockConditions as () => boolean;
    (buttonOptions.conditions as jest.Mock).mockReturnValue(true);
    const conditionFormVisible = createForm({
      schema: [
        {
          ...buttonOptions,
        },
      ],
    });
    const btnVisible: Button = conditionFormVisible.getButton(BUTTON_ID) as unknown as Button;
    conditionFormVisible.update();
    expect(mockConditions).toHaveBeenCalled();
    expect(btnVisible.getVisibility()).toBeTruthy();
    (buttonOptions.conditions as jest.Mock).mockReturnValue(false);
    const conditionFormHidden = createForm({
      schema: [
        {
          ...buttonOptions,
        },
      ],
    });
    const btnHidden: Button = conditionFormHidden.getButton(BUTTON_ID) as unknown as Button;
    conditionFormHidden.update();
    expect(mockConditions).toHaveBeenCalled();
    expect(btnHidden.getVisibility()).toBeFalsy();
  });

  it('updates visibility based on conditions string', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    button.update();
    expect(button.getVisibility()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    button.update();
    expect(button.getVisibility()).toBe(false);
  });

  it('destroys button, removing it from the DOM', () => {
    button.destroy();
    expect(document.querySelector('#' + BUTTON_ID)).toBeNull();
  });

  it('accepts template as function', () => {
    const mockFunction = jest.fn();
    mockFunction.mockReturnValue(document.createElement(DIV_ELEMENT));
    createForm({
      schema: [
        {
          ...buttonOptions,
          template: mockFunction,
        },
      ],
    });

    expect(mockFunction).toHaveBeenCalled();
  });

  it('triggers events properly', () => {
    const mockClickedListener = jest.fn();
    const mockVisibilityChangedListener = jest.fn();

    let testingValue = true;

    const form = createForm({
      schema: [
        {
          ...buttonOptions,
          conditions: () => {
            return testingValue;
          },
        },
      ],
    });

    const button = form.getButton(BUTTON_ID)! as unknown as Button;

    button?.on(ButtonEvents.Clicked, mockClickedListener, true);
    button?.on(ButtonEvents.VisibilityChanged, mockVisibilityChangedListener, true);

    button.buttonElement?.click();
    expect(mockClickedListener).toHaveBeenCalledTimes(1);
    testingValue = false;
    button.update();
    expect(mockVisibilityChangedListener).toHaveBeenCalledTimes(1);

    button?.off(ButtonEvents.Clicked, mockClickedListener, true);
    button?.off(ButtonEvents.VisibilityChanged, mockVisibilityChangedListener, true);

    button.buttonElement?.click();
    expect(mockClickedListener).toHaveBeenCalledTimes(1);
    testingValue = true;
    button.update();
    expect(mockVisibilityChangedListener).toHaveBeenCalledTimes(1);
  });

  //Expand on tests
});
