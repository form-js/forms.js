# Licensing

The licensing depends on whether you're using Premium plugins and fields.

## @formsjs/core

Non premium bundle released under MIT license. This license permits a wide range of use, including free use in commercial projects, assuming all copyright headers are preserved. [Read the license terms](https://opensource.org/license/mit/)

## @formsjs/vue

Non premium bundle released under MIT license. This license permits a wide range of use, including free use in commercial projects, assuming all copyright headers are preserved. [Read the license terms](https://opensource.org/license/mit/)

## Premium packages

Premium packages licensing depends on the type of use:

### Commercial Use

For-profit companies and individuals intending to use Formsjs premium plugins for commercial use must purchase a commercial license. This license allows source code modifications, but does not permit redistribution of modifications.

### Non-Commercial Use

[Registered non-profit organization](https://creativecommons.org/licenses/by-nc-nd/4.0/) (also known as "not-for-profit" or NGO) are able to use Formsjs premium plugins with a free, non-commercial license. Governmental entities and universities are not covered by this non-commercial license. This license does not permit source code modifications.

If you meet the criteria for this license, you may begin using FullCalendar Premium with this license key:

`CC-Attribution-NonCommercial-NoDerivatives`

### Use in GPLv3 open-source projects

Open-source projects that are fully GPLv3-compliant may use Formsjs premium plugins freely under the GPLv3 license.

[GPLv3 License agreement](https://www.gnu.org/licenses/gpl-3.0.en.html)

If you meet the criteria for this license, you may begin using Formsjs premium plugins with this license key:

`GPL-My-Project-Is-Open-Source`

For questions about more complex scenarios, please contact us.

### Purchase license

For purchasing a forms.js license please look at our [pricing ⚡️](https://formsjs.io/pricing).

## Adding an license

app.js
```js
import { Form, usePlugin, setLicenseKey } from "@forms.js/core";
import { pluginSettings as DateRangePlugin } from "@forms.js/daterange-field";
import { pluginSettings as RatingPlugin } from "@forms.js/rating-field";

setLicenseKey('license');

usePlugin([DateRangePlugin, RatingPlugin]);
window.Form = Form;
```

or you can pass the license key into the form as an option:

app.js
```js
import { Form } from "@forms.js/core";

const form = new Form("formElement", {
  id:"form",
  licenseKey: "license",
  ...
});
```

## List of premium plugins

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Functionality</th>
      <th>Links</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="font-bold">@formsjs/daterange-field</span></td>
      <td>Date Range field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/daterange-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/list-field</span></td>
      <td>List field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/list-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/rating-field</span></td>
      <td>Rating field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/rating-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/richtext-field</span></td>
      <td>Ritch Text field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/richtext-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/tabs</span></td>
      <td>Tabs component for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/tabs</a></td>
    </tr>
  </tbody>
</table>
