# Static Field

#### Options

The options object can include the following properties (you can find full list below):

-   `id: string` - <span class="badge warning">required</span> Unique identifier for the group.
-   `template: string | (() => HTMLElement)` - Defines string content or function that returns HTML content of static field.

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - static example" src="https://codepen.io/trilmatic/embed/NWomBOb?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/NWomBOb">
  forms.js - static example</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

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
      <td>conditions</td>
      <td><code>(value: FieldValue, data: FormData) => boolean;</code></td>
      <td>Conditional logic fuinction that returns boolean value defining if the field is currently visible or not.</td>
    </tr>
    <tr>
      <td>change</td>
      <td><code>(value: FieldValue) => void;</code></td>
      <td>Custom function triggered when field value is changed.</td>
    </tr>    
    <tr>
      <td>template</td>
      <td><code>string</code></td>
      <td>Defines html content of field.</td>
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
      <td><code>setTemplate(template: string | (() => HTMLElement), save?: boolean): void</code></td>
      <td>Sets new field template.</td>
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
      <td><code>getForm(): Form</code></td>
      <td>Retrieves the form instance to which the field belongs.</td>
    </tr>
    <tr>
      <td><code>reset(): Promise&lt;void&gt;</code></td>
      <td>Resets the field to its initial state.</td>
    </tr>
  </tbody>
</table>