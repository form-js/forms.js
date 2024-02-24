import { describe, expect, test, afterAll, beforeEach, afterEach, it, jest } from '@jest/globals';
import * as utils from './../utils';
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
    // Default options for creating a Group instance
    groupOptions = {
      id: GROUP_ID,
      type: 'group',
      className: 'form-group',
      schema: [],
      conditions: 'stringConditions',
      label: 'Group Label',
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
    expect(group.getVisibility()).toBe(true); // Default visibility
  });

  it('creates container and schema container elements', () => {
    expect(group.containerElement).toBeDefined();
    expect(group.schemaContainerElement).toBeDefined();
    expect(group.containerElement!.className).toBe('form-group-container');
    expect(group.schemaContainerElement!.className).toBe(groupOptions.className);
  });

  //Fix issues with the test
  /*it('handles visibility based on conditions', () => {
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(false);
    group.update();
    expect(group.getVisibility()).toBe(false);
    (utils.evaluateParsedConditions as jest.Mock).mockReturnValue(true);
    group.update();
    expect(group.getVisibility()).toBe(true);
  });*/

  it('destroys the group, removing it from the DOM and cleaning up', () => {
    group.destroy();
    expect(utils.unmountElement).toHaveBeenCalledWith(parentElement);
  });

  //expand on tests
});
