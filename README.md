# Vue Select

Enhanced select component for Vue.js, unlike other select components Vue Select will not manipulate the options you provide to it, instead we emit events allowing you to perform all the filtering, loading or whatever else you might want to do yourself.

## Features

- No dependencies
- v-model support
- Single select
- Multiple select
- Infinite loading on scroll
- Searchable
- Configurable
- Themeable

## Install

```bash
yarn add @optix/vue-select
```

## Mount

```javascript
import Vue from 'vue';
import VueSelect from '@optix/vue-select';

import '@optix/vue-select/dist/vue-select.min.css';

Vue.use(VueSelect, /* { options } */);
```

### Basic usage

```html
<template>
    <vue-select
        v-model="value"
        :options="options"
    />
</template>

<script>
export default {
    data() {
        return {
            value: null,

            options: [
                {
                    value: 'option-one',
                    label: 'Option One',
                },
                {
                    value: 'option-two',
                    label: 'Option Two',
                }
                // ...
            ],
        };
    };
};
</script>
```

```html
## JSFiddle Example

todo
```

## Options

### Props

| Name | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| v-model | `Array`, `Number`, `String` | `null` | Bind selected values between the Vue Select and your data |
| options | `Array` | `[]` | An array of objects, value will default to `option.value` and label will default to `option.label` |
| id | `String` | `null` | Used to identify the component in events |
| option-identifier | `String` | `'value'` | Name of the identifier used within the options `Object` |
| option-label | `String` | `'label'` | Name of the label used within the  options `Object`, this will be visible in the dropdown |
| loading | `Boolean` | `false` | Show / hide the loading indicator |
| loading-more | `Boolean` | `false` | Show / hide loading indicator when scrolled to bottom of options list |
| multiple | `Boolean` | `false` | Allows multiple options to be selected |
| disabled | `Boolean` | `false` | Enable / disable select |
| searchable | `Boolean` | `true` | Show / hide search input |
| open-direction | `String` | `'auto'` | Fix opening direction, options: `'down'`, `'up'` |
| placeholder | `String` | `'Please select...'` | Default placeholder text on select element |
| load-more-threshold | `Number` | `60` | Distance in px from bottom of dropdown before `@load-more` is emitted. |
| no-options-message | `String` | `'No options found.'` | Message shown when no options are provided |

### Events

| Event | Attributes | Description |
| :---- | :--------- | :---------- |
| `@input` | `(option|options)` | Emitted after the value changes |
| `@change` | `null` | Emitted after an option is selected or deselected |
| `@select` | `(option)` | Emitted after an option is selected |
| `@deselect` | `(option)` | Emitted after an option is deselected |
| `@search-change` | `(searchQuery)` | Emitted after the search query changes |
| `@load-more` | `null` | Emitted after dropdown has been scrolled past the `load-more-threshold` |

### Slots

#### Dropdown Option

**Name:** `dropdown-option`<br>
**Description:** Custom option template

**Slot-scope:**
- `option` - `Object` of the current option
- `classes` - `Object` containing 3 classes
```javascript
{
    focused: false,
    selected: false,
    disabled: false,
}
```
```html
<template #dropdown-option="{ option, classes }">
    <div class="vs-dropdown-option" :class="classes">
        {{ option.label }}
    </div>
</template>
```
#### Dropdown Loader

**Name:** `dropdown-loader`<br>
**Description:** Shows when no options are passed into the select

**Default:** Loading...

```html
<template #dropdown-loader>
    <div class="vs-dropdown-loader">
        Loading...
    </div>
</template>
```

## TODOs

- Throttle `@search-change` event, with default throttle rate specified via prop
- Throttle dropdown scroll `@load-more` event, with default throttle rate specified via prop

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
