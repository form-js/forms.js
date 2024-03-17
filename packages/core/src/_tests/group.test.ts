import { describe, expect, beforeEach, afterEach, it, jest } from '@jest/globals';
import * as utils from '../utils';
import { Group } from '../group';
import { GROUP_ID, createForm } from './test.options';
import { Form } from '../form';
import { GroupOptions } from '../interfaces';

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

describe('Group', () => {
  let parentElement: HTMLElement;
  let form: Form;
  let groupOptions: GroupOptions;
  let group: Group;

  beforeEach(() => {
    groupOptions = {
      id: GROUP_ID,
      type: 'group',
      className: 'form-group',
      schema: [],
      conditions: 'stringConditions',
      label: 'Group label',
    };

    form = createForm({
      schema: [
        {
          ...groupOptions,
        },
      ],
    });

    parentElement = document.createElement('div');
    group = form.getGroup(GROUP_ID) as unknown as Group;
  });

  afterEach(() => {
    document.body.innerHTML = ''; // Clean up the DOM
    jest.clearAllMocks(); // Reset mocks
  });

  it('initializes with provided options', () => {
    expect(group.getId()).toBe(groupOptions.id);
    expect(group.getType()).toBe(groupOptions.type);
    expect(group.getContainer()).toBeDefined();
    expect(group.getSchemaContainer()).toBeDefined();
    expect(group.getVisibility()).toBe(true);
  });

  it('creates container and schema container elements', () => {
    expect(group.containerElement).toBeDefined();
    expect(group.schemaContainerElement).toBeDefined();
    expect(group.containerElement!.className).toBe('form-group-container');
    expect(group.schemaContainerElement!.className).toBe(groupOptions.className);
  });

  it('parses string conditions correctly', () => {
    (utils.parseConditionString as jest.Mock).mockReturnValue([{ conditions: [], returnValue: true }]);
    group.initialize();
    expect(utils.parseConditionString).toHaveBeenCalledWith(groupOptions.conditions);
  });

  it('updates visibility based on conditions function', () => {
    const mockConditions = jest.fn();
    groupOptions.conditions = mockConditions as () => boolean;
    (groupOptions.conditions as jest.Mock).mockReturnValue(true);
    const conditionFormVisible = createForm({
      schema: [
        {
          ...groupOptions,
        },
      ],
    });
    const groupVisible: Group = conditionFormVisible.getGroup(GROUP_ID) as unknown as Group;
    conditionFormVisible.update();
    expect(mockConditions).toHaveBeenCalled();
    expect(groupVisible.getVisibility()).toBeTruthy();
    (groupOptions.conditions as jest.Mock).mockReturnValue(false);
    const conditionFormHidden = createForm({
      schema: [
        {
          ...groupOptions,
        },
      ],
    });
    const groupHidden: Group = conditionFormHidden.getGroup(GROUP_ID) as unknown as Group;
    conditionFormHidden.update();
    expect(mockConditions).toHaveBeenCalled();
    expect(groupHidden.getVisibility()).toBeFalsy();
  });

  it('updates visibility based on conditions string', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    group.update();
    expect(group.getVisibility()).toBe(true);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    group.update();
    expect(group.getVisibility()).toBe(false);
  });

  it('destroys the group, removing it from the DOM and cleaning up', () => {
    group.destroy();
    expect(utils.unmountElement).toHaveBeenCalledWith(parentElement);
  });

  //expand on tests
});
