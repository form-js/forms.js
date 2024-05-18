# Tabs

<span class="badge primary">Premium</span>

### Introduction

Tabs can bring more structure or "wizzard" type functionality into your complex forms.

You you can easily use this plugin with forms.js by provided `usePlugin` function.

app.js
```js
import { Form, usePlugin } from "@forms.js/core";
import { pluginSettings as TabsPlugin } from "@forms.js/tabs;

usePlugin(TabsPlugin);
window.Form = Form;
```

#### Options

The options object can include the following properties (you can find full list below):

-   `id: string` - <span class="badge warning">required</span> Unique identifier for the group.
-   `tabs: Tab[]` - <span class="badge warning">required</span> Define form tabs.

### Conditional logic

Conditional logic can be defined by the `conditions` option inside the tabs options. It accepts function that returns true if the element should be visible and false if not. Form `data` are passed into the function.

```js
conditions: (data: FormData) => boolean;
```

## Reference

### Available Options

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id <span class="badge warning">required</span></td>
      <td><code>string</code></td>
      <td>Identifier for the tabs element.</td>
    </tr>
    <tr>
      <td>type <span class="badge warning">required</span></td>
      <td><code>string</code></td>
      <td>"tabs"</td>
    </tr>
    <tr>
      <td>tabs <span class="badge warning">required</span></td>
      <td><code>TabOptions[]</code></td>
      <td>Tab definitions.</td>
    </tr>
    <tr>
      <td>strict</td>
      <td><code>boolean</code></td>
      <td>Defines if tabs are strict. If set to true, all elements in current tab will need to be validated and valid before tabs allow user to change to another tab. Default: <code>false</code>.</td>
    </tr>
    <tr>
      <td>conditions</td>
      <td><code>(data: FormData) => boolean;</code></td>
      <td>Conditional logic fuinction that returns boolean value defining if the field is currently visible or not.</td>
    </tr>   
    <tr>
      <td>className</td>
      <td><code>string</code></td>
      <td>Field css classes.</td>
    </tr>
  </tbody>
</table>

### Functions

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>getTabs(): Record&lt;string, Tab&gt;</code></td>
      <td>Retrieves the tabs object.</td>
    </tr>
    <tr>
      <td><code>getTab(id: string): Tab | null</code></td>
      <td>Retrieves the Tab based on given id.</td>
    </tr>
    <tr>
      <td><code>getCurrentTab(): Tab | null</code></td>
      <td>Retrieves the currently active Tab.</td>
    </tr>
    <tr>
      <td><code>isStrict(): boolean</code></td>
      <td>Retrieves if the tabs are strict.</td>
    </tr>
    <tr>
      <td><code>getTabIndex(id: string): number</code></td>
      <td>Retrieves the Tab index based on given id.</td>
    </tr>
    <tr>
      <td><code>getActiveTabId(): string</code></td>
      <td>Retrieves active tabs id.</td>
    </tr>
    <tr>
      <td><code>getAllowedTabs(): string[]</code></td>
      <td>Retrieves id of tabs that are allowed based on current form state (takes in considetation conditions and desabled tab states).</td>
    </tr>
    <tr>
      <td><code>activateTab(id: string): void</code></td>
      <td>Activates tab based on given id.</td>
    </tr>
    <tr>
      <td><code>next(): void</code></td>
      <td>Activates next allowed tab.</td>
    </tr>
    <tr>
      <td><code>prev(): void</code></td>
      <td>Activates previous allowed tab.</td>
    </tr>
    <tr>
      <td><code>update()</code></td>
      <td>Updates all the group element.</td>
    </tr>
    <tr>
      <td><code>getId(): string</code></td>
      <td>Gets the ID of the form.</td>
    </tr>
    <tr>
      <td><code>getType(): string</code></td>
      <td>Retrieves an fields type.</td>
    </tr>
    <tr>
      <td><code>getForm(): Form</code></td>
      <td>Retrieves the form instance to which the field belongs.</td>
    </tr>
    <tr>
      <td><code>reset(): Promise&lt;void&gt;</code></td>
      <td>Resets the field to its initial state.</td>
    </tr>
  </tbody>
</table>