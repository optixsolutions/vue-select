## Props

`id` - String
`v-model` - Array / String / Number of option values
`options` - Array (required)
`option-identifier` - String / Number (default: value)
`option-label` - String (default: label)
`loading` - Boolean, shows loading indicator when set to `true`
`loading-more` - Boolean, shows loading notifcation when scrolled to bottom of options list when set to `true`
`multiple` - Boolean (default: false)
`searchable` - Boolean (default: true)
`hide-selected` - Boolean (default: false)
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

```vue
<template #menu-option="{ option, classes }">
    <div class="multiselect-select-menu-option" :class="classes">
        {{ option.label }}
    </div>
</template>
```

`menu-loader`

```vue
<template #menu-loader>
    <div class="multiselect-select-menu-loading">
        Loading...
    </div>
</template>
```