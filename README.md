# Vue Select

Enhanced select component for Vue.js, unlike other select components Vue Select will not manipulate the options you provide to it, instead we emit events allowing you to perform all the filtering, loading or whatever else you might want to do yourself.

## Features

- No dependencies
- v-model support
- Single select
- Multiple select
- Infinite loading on scroll with throttling
- Searchable with debounce
- Configurable
- Themeable

## Install

```bash
yarn add @optix/vue-select
```

## Setup

```javascript
import Vue from 'vue';
import VueSelect from '@optix/vue-select';

import '@optix/vue-select/dist/vue-select.min.css';

Vue.use(VueSelect, /* { options } */);
```

## Basic usage

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
                    value: 1,
                    label: 'Option One',
                },
                {
                    value: 2,
                    label: 'Option Two',
                    disabled: true,
                }
                // ...
            ],
        };
    };
};
</script>
```

## Options

### Props

| Name | Type | Default Value | Description |
| :--- | :--- | :------------ | :---------- |
| value | `Array\|\|Number\|\|String` | `null` | Selects the given options |
| options | `Array` | `[]` | An array of objects |
| option-identifier | `String` | `'value'` | Name of the identifier used within the options `Object` |
| option-label | `String` | `'label'` | Name of the label used within the  options `Object`, this will be visible in the dropdown |
| id | `String` | `null` | Applied to the underlying input |
| loading | `Boolean` | `false` | Show / hide the loading indicator |
| loading-more | `Boolean` | `false` | Show / hide loading indicator when scrolled to bottom of options list |
| multiple | `Boolean` | `false` | Allows multiple options to be selected |
| searchable | `Boolean` | `true` | Show / hide search input |
| placeholder | `String` | `'Please select...'` | Default placeholder text on select element |
| disabled | `Boolean` | `false` | Enable / disable select |
| open-direction | `String` | `'auto'` | Fix opening direction, options:  `'auto'\|\|'down'\|\|'up'` |
| close-on-select | `Boolean` | `null` | Enable opening / closing after selecting an option |
| query-change-wait | `Number` | `150` | Delay in milliseconds after user finishes typing and `@search-change` is fired |
| scroll-throttle-wait | `Number` | `150` | Delay in milliseconds between firing scroll events |
| load-more-threshold | `Number` | `60` | Distance in px from bottom of options dropdown before `@load-more` is fired. |
| no-options-message | `String` | `'No options found.'` | Message shown when no options are provided |

### Events

| Event | Payload | Description |
| :---- | :--------- | :---------- |
| `@input` | `(options)` | Fires when the value changes |
| `@change` | `null` | Fires when an option is selected or deselected |
| `@select` | `(option)` | Fires when an option is selected |
| `@deselect` | `(option)` | Fires when an option is deselected |
| `@search-change` | `(searchQuery)` | Fires when the search query changes |
| `@load-more` | `null` | Fires when the `load-more-threshold` of the dropdown has been scrolled past |

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

- Working examples
- Ability to add new options via component

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
