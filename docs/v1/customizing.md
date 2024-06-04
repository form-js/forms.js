# Customizing

## Adjusting CSS

Here is the full list of css variables, you can adjust the variables to customize formsjs css visuals if you are using predefined styles.

```css
html {
    --formsjs-primary-color: rgb(0, 119, 255);
    --formsjs-primary-focus-color: rgb(0 100 220);
    --formsjs-error-color: rgb(178,34,34);
    --formsjs-disabled-color: rgb(97, 97, 97);
    --formsjs-disabled-focus-color: rgb(150, 150, 150);
    --formsjs-background-color: rgb(255, 255, 255);
    --formsjs-border-radius: .5rem;
    --formsjs-border-width: 1px;
}

html.dark{
    --formsjs-background-color: rgb(62, 62, 62);
}
```

## Writing custom plugins

You can write your custom plugins very easily 

```js
import { usePlugin, constructorTypes, Field } from "@formsjs/core";

class MyField extends Field {
 ...
}

const pluginSettings = {
  type: 'fieldtype',
  constructor: MyField,
  constructorType: constructorTypes.field,
}

usePlugin(pluginSettings);
```

then you can use your new field as any other field. It does not even need to extend the Field class, but if it has the required functions it can be a completly new class.

#### Costructor types

there is multiple constructor types each constructor expects different methods being avalable on the class.

**constructorTypes.field**

- update method
- reset method

**constructorTypes.group**

- update method

**constructorTypes.button**

- update method