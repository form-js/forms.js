# Fields

You can define fields in form schema. There are many types of fields out of the box that will satisfy most projects needs. If you still need more you can also add in the premium fields or even write your own as a plugin.

## Common traits

### Conditional logic

Conditional logic can be defined by the `conditions` option inside the field options. It accepts function that returns true if the element should be visible and false if not. Field `value` and form `data` are passed into the function.

```js
conditions: (value: FieldValue, data: FormData) => boolean;
```

<iframe height="300" style="width: 100%;" scrolling="no" title="forms.js - conditional logic" src="https://codepen.io/trilmatic/embed/WNPWOmO?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/WNPWOmO">
  forms.js - conditional logic</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

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

<iframe height="300" style="width: 100%;" scrolling="no" title="forms.js - validation" src="https://codepen.io/trilmatic/embed/MWLRodV?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/MWLRodV">
  forms.js - validation</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Required state

You can define if the field is requred by the `required` option inside the field options. It accepts eather boolen value or function that returns boolean value. Field `value` and form `data` are passed into the function.

```js
required: boolean | ((value: FieldValue, data: FormData) => boolean);
```

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - form submit example" src="https://codepen.io/trilmatic/embed/bGzJgjB?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/bGzJgjB">
  forms.js - form submit example</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Disabled state

You can define if the field is disabled by the `disabled` option inside the field options. It accepts eather boolen value or function that returns boolean value. Field `value` and form `data` are passed into the function.

```js
disabled: boolean | ((value: FieldValue, data: FormData) => boolean);
```

<iframe height="300" style="width: 100%;" scrolling="no" title="forms.js - disabled state" src="https://codepen.io/trilmatic/embed/LYqvjYw?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/LYqvjYw">
  forms.js - disabled state</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Field value and change event

## Value

In most fields you can retrive fields value with `getValue()` function called on the field instance.

If you need to set the fields value programically you can eather use `default` option in field options or `setValue(value: FieldValue, save: boolean = true)` function called on the field instance.

<iframe height="300" style="width: 100%;" scrolling="no" title="forms.js - default value" src="https://codepen.io/trilmatic/embed/VwgNzvL?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/VwgNzvL">
  forms.js - default value</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Change event

You can define the field change event by the `change` option inside the field options. It accepts function and field `value` is passed into this function.

```js
change: (value: FieldValue) => void;
```

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - change event" src="https://codepen.io/trilmatic/embed/JjxVyYQ?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/JjxVyYQ">
  forms.js - change event</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Fields list

- <a class="link" href="https://formsjs.io/documentation/v1/checkbox-field">Checkbox field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/color-field">Color field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/date-field">Date field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/datetime-field">Datetime field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/daterange-field">Daterange field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/email-field">Email field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/file-field">File field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/hidden-field">Hidden field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/list-field">List field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/number-field">Number field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/pasword-field">Password field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/radio-field">Radio field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/range-field">Range field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/rating-field">Rating field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/richtext-field">Richtext field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/select-field">Select field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/static-field">Static field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/tel-field">Telephone field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/textarea-field">Textarea field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/text-field">Text field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/time-field">Time field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/url-field">URL field</a>
- <a class="link" href="https://formsjs.io/documentation/v1/week-field">Week field</a>