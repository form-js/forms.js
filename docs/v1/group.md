# Groups

Group is designed to manage a group of form elements within a larger form structure. It provides a range of functionalities including conditional logic and prefixing igrouped fields inside form data set. Groups schema can have any form element except tabs.

#### Options

The options object can include the following properties (you can find full list below):

- `id: string` - <span class="badge warning">required</span> Unique identifier for the group.
- `schema: Schema[]` - <span class="badge warning">required</span> Schema defining the form structure.
- `label: string` - Group label (heading) that will appear at the top of the grouped elements.
- `prefixSchema: boolean` - You can prefix the grouped fileds inside the form `data` object by group id.

### Conditional logic

Conditional logic can be defined by the `conditions` option inside the group options. It accepts function that returns true if the group should be visible and false if not. Form `data` are passed into the function.

```js
conditions: (data: FormData) => boolean;
```

<iframe height="400" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/trilmatic/embed/gOqygVM?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/gOqygVM">
  Untitled</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Prefixing grouped elements

You can prefix grouped elements by group id. Form data object will then have the group id and all grouped field values will be grouped under this key. To enable this functonality you need to set the `prefixSchema` option inside group options to `true`.

```js
prefixSchema: boolean;
```

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - group example" src="https://codepen.io/trilmatic/embed/ZEwZWaW?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/ZEwZWaW">
  forms.js - group example</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Events

Groups have events that can be listened to if needed. You can add listener using on function avilable on fields that supports events. Data related to the event are stored in event detail. You can import the `GroupEvents` variable to have a constant with all available events.

```js
function listener(event) {
  //do stuff
}

group.on("visibilityChanged", listener, true);
```

<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>visibilityChanged</code></td>
      <td>Triggers when visibility condition of field is changed. The <code>isVisible</code> boolean is in the event detail.</td>
    </tr>
  </tbody>
</table>

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
      <td>Identifier for the group.</td>
    </tr>
    <tr>
      <td><code>label</code></td>
      <td>string</td>
      <td>Group label.</td>
    </tr>
    <tr>
      <td><code>conditions</code></td>
      <td>Function</td>
      <td>Conditional logic fuinction that returns boolean value defining if the group is currently visible or not.</td>
    </tr>
    <tr>
      <td><code>prefixSchema</code></td>
      <td>boolean</td>
      <td>Prefixes the groups elements in form <code>data</code> object by group id.</td>
    </tr>
    <tr>
      <td><code>schema</code> <span class="badge warning">required</span></td>
      <td>Schema[]</td>
      <td>Schema defining the form structure.</td>
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
