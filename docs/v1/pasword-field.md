# Password Field

#### Options

The options object can include the following properties (you can find full list below):

-   `id: string` - <span class="badge warning">required</span> Unique identifier for the group.
-   `required: boolean | Function` - Defines if field is required.
-   `default: FieldValue` - Defines default value.

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/trilmatic/embed/GRzLBEV?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/GRzLBEV">
  Untitled</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Conditional logic

Conditional logic can be defined by the `conditions` option inside the field options. It accepts function that returns true if the element should be visible and false if not. Field `value` and form `data` are passed into the function.

```js
conditions: (value: FieldValue, data: FormData) => boolean;
```

### Validation and validation message

Validation can be defined by the `validation` option inside the field options. It accepts function that returns `true` if the field is validated correctly or validation message `string` if there is an validation error. Field `value` and `required` attribute and form `data` are passed into the function.

```js
validation: (value: FieldValue, data: FormData, required: boolean) => true | string;
```

**Default value**

```js
validation: (value, data, required) => {
    if (required && !value) return 'This field is required';
    return true;
},
```

### Required state

You can define if the field is requred by the `required` option inside the field options. It accepts eather boolen value or function that returns boolean value. Field `value` and form `data` are passed into the function.

```js
required: boolean | ((value: FieldValue, data: FormData) => boolean);
```

### Disabled state

You can define if the field is disabled by the `disabled` option inside the field options. It accepts eather boolen value or function that returns boolean value. Field `value` and form `data` are passed into the function.

```js
disabled: boolean | ((value: FieldValue, data: FormData) => boolean);
```

## Field value and change event

## Value

In most fields you can retrive fields value with `getValue()` function called on the field instance.

If you need to set the fields value programically you can eather use `default` option in field options or `setValue(value: FieldValue, save: boolean = true)` function called on the field instance.


## Change event

You can define the field change event by the `change` option inside the field options. It accepts function and field `value` is passed into this function.

```js
change: (value: FieldValue) => void;
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
    <tr>
    <td>label</td>
      <td><code>string</code></td>
      <td>Defiles fields label.</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td>Defiles fields name.</td>
    </tr>
    <tr>
      <td>conditions</td>
      <td><code>(value: FieldValue, data: FormData) => boolean;</code></td>
      <td>Conditional logic fuinction that returns boolean value defining if the field is currently visible or not.</td>
    </tr>
    <tr>
      <td>required</td>
      <td><code>boolean | value: FieldValue, data: FormData) => boolean</code></td>
      <td>Defines if the field is required or not. Default is false.</td>
    </tr>
    <tr>
      <td>validation</td>
      <td><code>(value: FieldValue, data: FormData, required: boolean) => true | string;</code></td>
      <td>Defines the validation method of the field. By default validates empty required field as not valid.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean | (value: FieldValue, data: FormData) => boolean</code></td>
      <td>Defines if the field is disabled or not. Default is false.</td>
    </tr>
    <tr>
      <td>default</td>
      <td><code>boolean</code></td>
      <td>Default value of the field.</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td><code>string</code></td>
      <td>Defines fields placeholder.</td>
    </tr>
    <tr>
      <td>debounce</td>
      <td><code>number</code></td>
      <td>Debounce time for the change event.</td>
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
      <td><code>setValue(value: FieldValue, save?: boolean): void</code></td>
      <td>Sets the field's value.</td>
    </tr>
    <tr>
      <td><code>getValue(): FieldValue</code></td>
      <td>Retrieves the field's value.</td>
    </tr>
    <tr>
      <td><code>update()</code></td>
      <td>Updates all the group element.</td>
    </tr>
    <tr>
      <td><code>validate(): boolean</code></td>
      <td>Validates the field based on the configured validation function.</td>
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
      <td><code>getForm(): Form</code></td>
      <td>Retrieves the form instance to which the field belongs.</td>
    </tr>
    <tr>
      <td><code>reset(): Promise&lt;void&gt;</code></td>
      <td>Resets the field to its initial state.</td>
    </tr>
  </tbody>
</table>