# Buttons

#### Options

The options object can include the following properties (you can find full list below):

-   `id: string` - <span class="badge warning">required</span> Unique identifier for the group.
-   `template: string | (() => HTMLElement)` - Button template, it can be just string or an function that returns HTML element.
-   `buttonType: 'submit' | 'reset' | 'button'` - Defines a button type attribute.
-   `click: (event: MouseEvent, data: FormData) => void;` - Defines custom on click function. Form `data` are passed into the function.

### Conditional logic

Conditional logic can be defined by the `conditions` option inside the group options. It accepts function that returns true if the group should be visible and false if not. Form `data` are passed into the function.

```js
conditions: (data: FormData) => boolean;
```

### Binding click function

You can bind click function by the `click` option inside the button options. `MouseEvent` and Form `data` are passed into the function.

```js
click: (event: MouseEvent, data: FormData) => void;
```

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - buttons example" src="https://codepen.io/trilmatic/embed/JjxVWmG?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/JjxVWmG">
  forms.js - buttons example</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

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
      <td><code>id</code> <span class="badge warning">required</span></td>
      <td>string</td>
      <td>Identifier for the button.</td>
    </tr>
    <tr>
      <td><code>template</code></td>
      <td>string</td>
      <td>Button template, it can be just string or an function that returns HTML element.</td>
    </tr>
    <tr>
      <td><code>conditions</code></td>
      <td>Function</td>
      <td>Conditional logic fuinction that returns boolean value defining if the button is currently visible or not.</td>
    </tr>
    <tr>
      <td><code>buttonType</code></td>
      <td><code>submit</code> | <code>reset</code> | <code>button</code></td>
      <td>Defines button type attribute. Default is <code>submit</code></td>
    </tr>
    <tr>
      <td>click</td>
      <td>click: (event: MouseEvent, data: FormData) => void;</td>
      <td>Click function.</td>
    </tr>
    <tr>
      <td><code>className</code></td>
      <td>string</td>
      <td>CSS class for the group.</td>
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
      <td><code>update()</code></td>
      <td>Updates all the group element.</td>
    </tr>
    <tr>
      <td><code>getId()</code></td>
      <td>Gets the ID of the form.</td>
    </tr>
    <tr>
      <td><code>getContainer()</code></td>
      <td>Retrieves a group container element.</td>
    </tr>
    <tr>
      <td><code>getSchemaContainer()</code></td>
      <td>Retrieves a group elements container element.</td>
    </tr>
    <tr>
      <td><code>getType()</code></td>
      <td>Retrieves an elements type.</td>
    </tr>
    <tr>
      <td><code>getVisibility()</code></td>
      <td>Retrieves current visibility state based on the conditional logic.</td>
    </tr>
  </tbody>
</table>