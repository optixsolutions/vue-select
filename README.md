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

### Required Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| v-model | `Array`, `Number`, `String` | `null` | todo |
| options | `Array` | `[]` | An array of `Objects`, value will default to `option.value` and label will default to `option.label`. |

### Optional Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| id | `String` | `null` | Used to identify the component in events. |
| option-identifier | `String` | `'value'` | Name of the identifier used within the options `Object` |
| option-label | `String` | `'label'` | Name of the label used within the  options `Object`, this will be visible in the dropdown |
| loading | `Boolean` | `false` | Show / hide the loading indicator |

`loading` - Boolean, shows loading indicator when set to `true`
`loading-more` - Boolean, shows loading notifcation when scrolled to bottom of options list when set to `true`
`multiple` - Boolean (default: false)
`searchable` - Boolean (default: true)
`open-direction` - String ['auto', 'down', 'up'] (default: 'auto')
`placeholder` - String (default: Please select...)
`no-options-message` - String (default: No options found.)

## Events

`@select`
`@deselect`
`@load-more`
`@search-change`

## Slots

`menu-option` - Slot-scope `option`, `classes`

```html
<template #menu-option="{ option, classes }">
    <div class="multiselect-select-menu-option" :class="classes">
        {{ option.label }}
    </div>
</template>
```

`menu-loader`

```html
<template #menu-loader>
    <div class="multiselect-select-menu-loading">
        Loading...
    </div>
</template>
```