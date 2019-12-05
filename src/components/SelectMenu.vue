<template>
    <div class="multiselect-select-menu">
        <div class="multiselect-select-menu-inner">
            <div
                v-for="option in options"
                :key="option.value"
                class="multiselect-select-menu-option"
                :class="{
                    'selected': isSelected(option.value),
                    'disabled': isDisabled(option),
                }"
            >
                {{ option.label }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            default: () => [],
        },

        selectedOptionValues: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        isSelected(value) {
            return this.selectedOptionValues.includes(value);
        },

        isDisabled(option) {
            return option.disabled || false;
        },
    },
};
</script>
