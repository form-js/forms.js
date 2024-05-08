# Daterange Field

### Introduction

Daterange field is an separate premium plugin that can be used in forms.js package. User can pick a date range as an output value of the field.

You you can easily use this plugin with forms.js by provided `usePlugin` function.

app.js

```js
import { Form, usePlugin } from "@forms.js/core";
import { pluginSettings as ListPlugin } from "@forms.js/list-field";

usePlugin(ListPlugin);
window.Form = Form;
```

To get valid license please look at <a class="link" href="https://formsjs.io/documentation/v1/licensing">licensing page</a>.

#### Options

The options object can include the following properties (you can find full list below):

- `id: string` - <span class="badge warning">required</span> Unique identifier for the group.
- `schema: Schema` - <span class="badge warning">required</span> Defines the list fields schema.
- `buildButtons: boolean` - Defines if the list should automatically build add and remove buttons.

You can work with a list key fields the same way as with any other field. The fields value will be prefixed by the list field id and index of the current row in the list.



### Conditional logic

Conditional logic can be defined by the `conditions` option inside the field options. It accepts function that returns true if the element should be visible and false if not. Field `value` and form `data` are passed into the function.

```js
conditions: (value: FieldValue, data: FormData) => boolean;
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
      <td>Identifier for the field.</td>
    </tr>
    <tr>
      <td>type <span class="badge warning">required</span></td>
      <td><code>string</code></td>
      <td>Type of the field.</td>
    </tr>
    <tr>
      <td>schema <span class="badge warning">required</span></td>
      <td><code>Schema</code></td>
      <td>List fields schema definition.</td>
    </tr>
    <tr>
      <td>buildButtons</td>
      <td><code>boolean</code></td>
      <td>Defines if add and remove buttons are automatically build.</td>
    </tr>
    <tr>
      <td>listRemoveClassName</td>
      <td><code>string</code></td>
      <td>Defines remove button class name.</td>
    </tr>
    <tr>
      <td>listAddClassName</td>
      <td><code>string</code></td>
      <td>Defines add button class name.</td>
    </tr>
    <tr>
      <td>listRemoveTemplate</td>
      <td><code>string | (() => HTMLElement)</code></td>
      <td>Defines remove button tamplate.</td>
    </tr>
    <tr>
      <td>listAddTemplate</td>
      <td><code>string | (() => HTMLElement)</code></td>
      <td>Defines add button tamplate.</td>
    </tr>
    <tr>
      <td>conditions</td>
      <td><code>(value: FieldValue, data: FormData) => boolean;</code></td>
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
      <td><code>addListRow(defkey: string | null = null, save: boolean = true): void</code></td>
      <td>Creates a new row in the list field.</td>
    </tr>
    <tr>
      <td><code>removeListRow(key: string, save: boolean = true): void</code></td>
      <td>Removes a existing row in the list field based on key.</td>
    </tr>
    <tr>
      <td><code>getKeyIndex(key: string): number</code></td>
      <td>Retrieves the index based on row definition key.</td>
    </tr>
    <tr>
      <td><code>getId(): string</code></td>
      <td>Gets the ID of the form.</td>
    </tr>
    <tr>
      <td><code>getSaveKey(): string</code></td>
      <td>Retrieves the key used for saving the field's state.</td>
    </tr>
    <tr>
      <td><code>getType(): string</code></td>
      <td>Retrieves an fields type.</td>
    </tr>
    <tr>
      <td><code>getVisibility(): boolean</code></td>
      <td>Retrieves current visibility state based on the conditional logic.</td>
    </tr>
    <tr>
      <td><code>getFields(): Record&lt;string, any&gt;</code></td>
      <td>Retrieves all fields assigned to the list field.</td>
    </tr>
    <tr>
      <td><code>getButtons(): Record&lt;string, any&gt;</code></td>
      <td>Retrieves all buttons assigned to the list field.</td>
    </tr>
    <tr>
      <td><code>getGroups(): Record&lt;string, any&gt;</code></td>
      <td>Retrieves all groups assigned to the list field.</td>
    </tr>
    <tr>
      <td><code>getForm(): Form</code></td>
      <td>Retrieves the form instance to which the field belongs.</td>
    </tr>
    <tr>
      <td><code>getContainer(): HTMLElement | null</code></td>
      <td>Retrieves list fields container element.</td>
    </tr>
    <tr>
      <td><code>reset(): Promise&lt;void&gt;</code></td>
      <td>Resets the field to its initial state.</td>
    </tr>
    <tr>
      <td><code>update()</code></td>
      <td>Updates all the group element.</td>
    </tr>
    <tr>
      <td><code>removeAllLists(): void</code></td>
      <td>Removes all list rows from list field.</td>
    </tr>
  </tbody>
</table>
