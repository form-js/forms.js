import { Form, mountElement, unmountElement, FormData } from '@forms.js/core';
import { TabOptions } from './tab';
import { Tab } from './tab.js';

export class Tabs {
  public options: TabsOptions = {
    id: '',
    type: 'tabs',
    className: 'form-tabs',
    strict: false,
    tabs: [
      {
        id: 'test-tab',
        label: 'Test tab',
        schema: [],
      },
    ],
  };
  public containerElement: HTMLElement | null = null;
  public headerElement: HTMLElement | null = null;
  public bodyElement: HTMLElement | null = null;

  private _id: string;
  private _parent: HTMLElement;
  private _form: Form;
  private _isMounted: boolean = false;
  private _isVisible: boolean = true;
  private _type: string;
  private _strict: boolean;
  private _tabs: Record<string, Tab> = {};
  private _tabsList: TabOptions[];
  private _activeTab: string = 'none';

  /**
   * Initializes the Tabs instance with provided configuration options.
   * @param parent - The parent element to which the tabs will be appended.
   * @param form - The form associated with the tabs.
   * @param options - The configuration options for the tabs.
   */
  constructor(parent: HTMLElement, form: Form, options: TabsOptions) {
    this.initializeOptions(options);
    this._parent = parent;
    this._form = form;
    this._id = this.options.id;
    this._tabsList = this.options.tabs;
    this._strict = this.options.strict || false;
    this._type = options.type;
    this.onGui();
    this.buildTabs();
    this.initialize();
  }

  /**
   * Overrides default options with provided configuration options.
   * @param options - New configuration options to be applied.
   */
  initializeOptions(options: TabsOptions): void {
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * Creates tab instances based on the provided tabs list.
   */
  buildTabs(): void {
    this._tabsList.forEach((tab) => {
      const constructed: Tab = new Tab(this._form, this, tab, this.headerElement, this.bodyElement);
      this._tabs[tab.id] = constructed;
      this._form.buildSchema(constructed.getSchema(), constructed.getBody() ?? this._parent);
    });

    const allowedTabs: string[] = this.getAllowedTabs();
    const firstTab: Tab | null = this.getTab(allowedTabs[0]);
    if (!firstTab) return;
    this.activateTab(firstTab.getId());
  }

  /**
   * Resets and initializes the tabs, ensuring they are rendered correctly.
   */
  async initialize(): Promise<void> {
    await this.reset();
    this.handleVisibility();
  }

  /**
   * Returns the ID of the tabs.
   * @returns The ID of the tabs.
   */
  getId(): string {
    return this._id;
  }

  /**
   * Retrieves all tab instances.
   * @returns An object containing all tab instances.
   */
  getTabs(): object {
    return this._tabs;
  }

  /**
   * Gets the currently active tab instance.
   * @returns The currently active tab instance or null if none is active.
   */
  getCurrentTab(): Tab | null {
    return this.getTab(this._activeTab);
  }

  /**
   * Returns the main container element of the tabs.
   * @returns The main container element of the tabs or null if it doesn't exist.
   */
  getContainer(): HTMLElement | null {
    return this.containerElement;
  }

  /**
   * Retrieves the type of the tabs.
   * @returns The type of the tabs.
   */
  getType(): string {
    return this._type;
  }

  /**
   * Checks if the tabs are currently visible.
   * @returns True if the tabs are visible, otherwise false.
   */
  getVisibility(): boolean {
    return this._isVisible;
  }

  /**
   * Determines if the tab behaviour is strict.
   * @returns True if the behaviour is strict, otherwise false.
   */
  isStrict(): boolean {
    return this._strict;
  }

  /**
   * Retrieves the index of a tab based on its ID.
   * @param id - The ID of the tab.
   * @returns The index of the tab.
   */
  getTabIndex(id: string): number {
    const allowedTabs: string[] = this.getAllowedTabs();
    return allowedTabs.findIndex((tab) => tab === id);
  }

  /**
   * Retrieves a tab instance based on its ID.
   * @param id - The ID of the tab.
   * @returns The tab instance or null if it doesn't exist.
   */
  getTab(id: string): Tab | null {
    const tab: Tab = this._tabs[id];
    if (!tab) return null;
    return tab;
  }

  /**
   * Gets the ID of the currently active tab.
   * @returns The ID of the currently active tab.
   */
  getActiveTabId(): string {
    return this._activeTab;
  }

  /**
   * Lists all the allowed (non-disabled) tabs.
   * @returns An array of IDs of the allowed tabs.
   */
  getAllowedTabs(): string[] {
    const allowedTabs: string[] = [];
    this._tabsList.forEach((options: TabOptions) => {
      const tab: Tab = this._tabs[options.id];
      if (!tab.isDisabled()) allowedTabs.push(tab.getId());
    });
    return allowedTabs;
  }

  /**
   * Creates the headers element for the tabs.
   */
  createTabHeadersElement(): void {
    this.headerElement = document.createElement('div');
    this.headerElement.className = 'form-tabs-header';
    if (this.options.strict) this.headerElement.className += ' strict';
    this.headerElement.setAttribute('id', this._id + '_tabs_header');
    this.headerElement.setAttribute('role', 'tablist');
  }

  /**
   * Creates the main container element for the tabs.
   */
  createContainerElement(): void {
    this.containerElement = document.createElement('div');
    this.containerElement.className = this.options.className!;
    this.containerElement.setAttribute('id', this._id);
  }

  /**
   * Creates the body element for the tabs.
   */
  createTabBodyElement(): void {
    this.bodyElement = document.createElement('div');
    this.bodyElement.className = 'form-tabs-body';
    this.bodyElement.setAttribute('id', this._id + '_tab_body');
  }

  /**
   * Sets up the graphical user interface elements for the tabs.
   */
  onGui(): void {
    this.createContainerElement();
    this.createTabHeadersElement();
    this.createTabBodyElement();

    if (this.containerElement && this.headerElement) mountElement(this.headerElement, this.containerElement);
    if (this.containerElement && this.bodyElement) mountElement(this.bodyElement, this.containerElement);
  }

  /**
   * Activates a specific tab based on its ID.
   * @param id - The ID of the tab to activate.
   */
  activateTab(id: string): void {
    const activeTab: Tab = this._tabs[id];
    if (!activeTab) return;
    Object.keys(this._tabs).forEach((key: string) => {
      const tab: Tab = this._tabs[key];
      tab.deactivate();
    });
    activeTab.activate();
    this._activeTab = id;
    this._form.update();
  }

  /**
   * Activates a specific tab based on its ID with additional logic for strict mode.
   * @param id - The ID of the tab to activate.
   */
  activate(id: string): void {
    if (this._strict) {
      /* Dont allow more then one tab */
      const allowedTabs: string[] = this.getAllowedTabs();
      const activateIndex = allowedTabs.indexOf(id);
      const currentIndex = allowedTabs.indexOf(this._activeTab);
      if (activateIndex > currentIndex + 1) {
        /* If not following order do not allow change */
        const newTab: Tab | null = this.getTab(id);
        if (newTab?.getValidity() !== true) return;
      }
      /* validate current tab */
      const tab = this.getCurrentTab();
      if (!tab?.validate()) return;
    }

    this.activateTab(id);
  }

  /**
   * Appends the tabs container element to its parent.
   */
  private mount(): void {
    if (this.containerElement) mountElement(this.containerElement, this._parent);
    this._isMounted = true;
  }

  /**
   * Removes the tabs container element from its parent.
   */
  private unmount(): void {
    if (this.containerElement) unmountElement(this.containerElement);
    this._isMounted = false;
  }

  /** Fully removes the element from the DOM. */
  destroy(): void {
    if (this._parent) unmountElement(this._parent);
  }

  /**
   * Activates the next tab in the sequence.
   */
  next(): void {
    const allowedTabs: string[] = this.getAllowedTabs();
    const index = allowedTabs.findIndex((tab) => tab === this._activeTab);
    if (index >= allowedTabs.length - 1) return;
    const id = allowedTabs[index + 1];
    this.activate(id);
  }

  /**
   * Activates the previous tab in the sequence.
   */
  prev(): void {
    const allowedTabs: string[] = this.getAllowedTabs();
    const index = allowedTabs.findIndex((tab) => tab === this._activeTab);
    if (index <= 0) return;
    const id = allowedTabs[index - 1];
    this.activate(id);
  }

  /**
   * Resets the tabs to their initial state.
   */
  async reset(): Promise<void> {
    this.update();
  }

  /**
   * Updates the visibility and status of the tabs based on their current state.
   */
  async update(): Promise<void> {
    this.updateVisibilityBasedOnConditions();
    this.handleVisibility();
    Object.keys(this._tabs).forEach((key: string) => {
      const tab: Tab = this._tabs[key];
      tab.update();
    });
  }

  /**
   * Toggles the visibility of the tabs container based on the current visibility state.
   */
  handleVisibility(): void {
    if (this._isVisible && !this._isMounted) this.mount();
    if (!this._isVisible && this._isMounted) this.unmount();
  }

  /** Updates visibility based on options. */
  updateVisibilityBasedOnConditions(): void {
    if (this.options.conditions) this._isVisible = this.options.conditions(this._form.getData());
  }
}

export interface TabsOptions {
  id: string;
  type: 'tabs';
  conditions?: (data: FormData) => boolean;
  className?: string;
  tabs: TabOptions[];
  strict?: boolean;
}
