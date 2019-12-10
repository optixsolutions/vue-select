## Props

`id` - String
`v-model` - Array / String / Number of option values
`options` - Array
`multiple` - Boolean (default false)
`searchable` - Boolean (default true)
`hide-selected` - Boolean (default false)
`open-direction` - String ['auto', 'down', 'up'] (default 'auto')

## Events

`@select`
`@deselect`
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