# Tab

<span class="badge primary">Premium</span>

#### Options

The options object can include the following properties (you can find full list below):

- `id: string` - <span class="badge warning">required</span> Unique identifier for the group.
- `label: string | (() => HTMLElement)` - <span class="badge warning">required</span> Define tab label.
- `schema: Schema` - <span class="badge warning">required</span> Define tab label.

### Conditional logic

Conditional logic can be defined by the `conditions` option inside the tab options. It accepts function that returns true if the element should be visible and false if not. Field `value` and form `data` are passed into the function.

```js
conditions: (data: FormData) => boolean;
```

### Validation and validation message

Validation can be defined by the `validation` option inside the tab options. It accepts function that returns `true` if the field is validated correctly or validation message `string` if there is an validation error. Form `data` are passed into the function.

```js
validation: (data: FormData) => true | string;
```

### Disabled state

You can define if the field is disabled by the `disabled` option inside the tab options. It accepts eather boolen value or function that returns boolean value. Form `data` are passed into the function.

```js
disabled: boolean | ((data: FormData) => boolean);
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
      <td>"tab"</td>
    </tr>
    <tr>
      <td>label <span class="badge warning">required</span></td>
      <td><code>string | (() => HTMLElement)</code></td>
      <td>Defines tab label.</td>
    </tr>
    <tr>
      <td>schema <span class="badge warning">required</span></td>
      <td><code>Schema</code></td>
      <td>The form structure under the tab.</td>
    </tr>
    <tr>
      <td>conditions</td>
      <td><code>(data: FormData) => boolean;</code></td>
      <td>Conditional logic fuinction that returns boolean value defining if the field is currently visible or not.</td>
    </tr>
    <tr>
      <td>validation</td>
      <td><code>(data: FormData) => true | string;</code></td>
      <td>Defines the validation method of the tab. By default there is no extra tab validation.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean | (data: FormData) => boolean</code></td>
      <td>Defines if the tab is disabled or not. Default is false.</td>
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
      <td><code>getFields(): string[]</code></td>
      <td>Retrieves the ids of tab fields.</td>
    </tr>
    <tr>
      <td><code>isActive(): boolean</code></td>
      <td>Returns true if tab is active.</td>
    </tr>
    <tr>
      <td><code>getBody(): HTMLElement | null</code></td>
      <td>Retrieves tab body element.</td>
    </tr>
    <tr>
      <td><code>getHeader(): HTMLElement | null</code></td>
      <td>Retrieves tab header element.</td>
    </tr>
    <tr>
      <td><code>getVisibility(): boolean</code></td>
      <td>Retrieves current visibility state based on the conditional logic.</td>
    </tr>
    <tr>
      <td><code>getValidity(): boolean | null</code></td>
      <td>Retrieves current validation state based on the validation function.</td>
    </tr>
    <tr>
      <td><code>isDisabled(): boolean</code></td>
      <td>Retrieves current disabled state.</td>
    </tr>
    <tr>
      <td><code>getValidationMessage(): string | null</code></td>
      <td>Retrieves current validation message.</td>
    </tr>
    <tr>
      <td><code>validate(): boolean</code></td>
      <td>Validates the tab based on the configured validation function.</td>
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
