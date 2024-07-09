# Form

An overview of a Form class, its initialization, data management, and a complete reference.

Forms js is made for json submission, however if you want to use standard form submit it is completly possible, just define `action` and `method` in form options.

### Initialization and Options

#### Class Constructor

The Form class is instantiated with two parameters: `parent` (id or HTMLElement) and `options`.

- `parent: HTMLElement | string` - The parent HTML element where the form will be mounted or element ID string.
- `options: FormOptions` - Configuration options for the form.

#### Options

The options object can include the following properties (you can find full list below):

- `id: string` - <span class="badge warning">required</span> Unique identifier for the form.
- `submit: (data) => void` - Define custom submit function
- `useFormData: boolean` - If set to true it automatically converts the data object into <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank">FormData</a> before submit.
- `schema: Schema[]` - <span class="badge warning">required</span> Schema defining the form structure.

### Schema

Schema defines form fields and structure. Each form field must have unique `id` and `type` that defines what field will be generated. Other that that there might be more options needed based on specific field. You can find more in each fields documentation.

Example schema:

```js
  ...,
  schema: [
    {
      id: "email",
      type:"email",
      label: "Email",
      required: true,
    },
    {
      id:"button-group",
      type:"group",
      schema:[
         {
            id: "submit-button",
            type:"button",
            label: "Submit",
            className: "btn"
         },
      ]
    }
  ],
  ...
```

### Data Object and Submit

## Data Management

- `getData()` - Retrieves all form data. Returns FormData object.

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - form submit example" src="https://codepen.io/trilmatic/embed/bGzJgjB?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/bGzJgjB">
  forms.js - form submit example</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Saving progress <span class="badge primary">premium</span>

You can save the users progress for the form so even if he leaves the page, when he comes back, previously filled values will be loaded.

You can do so by setting the `saveProgress` option to true. Saved values are reset on form resets, but you will need to manually reset the form on successfull sumission on the backend to clear the values.

## Events

Form has events that can be listened to if needed. You can add listener using on function avilable on fields that supports events. Data related to the event are stored in event detail. You can import the `FormEvents` variable to have a constant with all available events.

```js
function listener(event) {
  //do stuff
}

form.on("submitted", listener, true);
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
      <td><code>submitted</code></td>
      <td>Triggers after form submission. The form data are in the event detail.</td>
    </tr>
    <tr>
      <td><code>resetted</code></td>
      <td>Triggers after field reset.</td>
    </tr>
    <tr>
      <td><code>validationFailedOnSubmit</code></td>
      <td>Triggers when validation fails on form submit.</td>
    </tr>
    <tr>
      <td><code>dataUpdated</code></td>
      <td>Triggers when form data changed. The form data are in the event detail.</td>
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
      <td>Identifier for the form.</td>
    </tr>
    <tr>
      <td><code>saveProgress</code> <span class="badge primary">premium</span></td>
      <td>boolean</td>
      <td>Indicates if form progress should be saved.</td>
    </tr>
    <tr>
      <td><code>useFormData</code></td>
      <td>boolean</td>
      <td>Use <code>FormData</code> for data handling.</td>
    </tr>
    <tr>
      <td><code>schema</code> <span class="badge warning">required</span></td>
      <td>Schema[]</td>
      <td>Schema defining the form structure.</td>
    </tr>
    <tr>
      <td><code>action</code></td>
      <td>string</td>
      <td>URL for form submission.</td>
    </tr>
    <tr>
      <td><code>method</code></td>
      <td>string</td>
      <td>HTTP method for form submission.</td>
    </tr>
    <tr>
      <td><code>className</code></td>
      <td>string</td>
      <td>CSS class for the form.</td>
    </tr>
    <tr>
      <td><code>licenseKey</code> <span class="badge primary">premium</span></td>
      <td>string</td>
      <td>Key for licensed features.</td>
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
      <td><code>buildSchema(schema, parent, groupId, listId, key)</code></td>
      <td>Processes and constructs form elements based on the provided schema.</td>
    </tr>
    <tr>
      <td><code>update()</code></td>
      <td>Updates all elements of the form.</td>
    </tr>
    <tr>
      <td><code>getField(id)</code></td>
      <td>Fetches a specified field from the form by ID.</td>
    </tr>
    <tr>
      <td><code>getFormElement()</code></td>
      <td>Gets the main form element.</td>
    </tr>
    <tr>
      <td><code>setData(id, value)</code></td>
      <td>Updates the form data with the provided value.</td>
    </tr>
    <tr>
      <td><code>getId()</code></td>
      <td>Gets the ID of the form.</td>
    </tr>
    <tr>
      <td><code>getData()</code></td>
      <td>Retrieves all data from the form.</td>
    </tr>
    <tr>
      <td><code>getButtons()</code></td>
      <td>Retrieves all buttons from the form.</td>
    </tr>
    <tr>
      <td><code>getButton(id)</code></td>
      <td>Fetches a specified button from the form by ID.</td>
    </tr>
    <tr>
      <td><code>getGroups()</code></td>
      <td>Fetches all groups present in the form.</td>
    </tr>
    <tr>
      <td><code>getGroup(id)</code></td>
      <td>Fetches a specified group from the form by ID.</td>
    </tr>
    <tr>
      <td><code>savesProgress()</code></td>
      <td>Checks if the form saves progress.</td>
    </tr>
    <tr>
      <td><code>isValid()</code></td>
      <td>Returns <code>boolean</code> of current form validity state.</td>
    </tr>
    <tr>
      <td><code>hasValidLicense()</code></td>
      <td>Checks if the form has a valid license.</td>
    </tr>
    <tr>
      <td><code>updateError(id, isValid)</code></td>
      <td>Updates the form's error state for a specific field.</td>
    </tr>
    <tr>
      <td><code>reset(event)</code></td>
      <td>Resets all elements of the form.</td>
    </tr>
    <tr>
      <td><code>submit(event?)</code></td>
      <td>Submits the form manually.</td>
    </tr>
    <tr>
      <td><code>validate()</code></td>
      <td>Validates all fields of the form.</td>
    </tr>
    <tr>
      <td><code>getErrors()</code></td>
      <td>Returns array of ids of fields where are errors.</td>
    </tr>
    <tr>
      <td><code>save()</code> <span class="badge primary">premium</span></td>
      <td>Saves the form state if enabled.</td>
    </tr>
    <tr>
      <td><code>load()</code> <span class="badge primary">premium</span></td>
      <td>Loads the saved form state if enabled.</td>
    </tr>
  </tbody>
</table>
