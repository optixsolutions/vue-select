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
                @click="toggleSelect(option)"
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

        selectedOptions: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        selectedOptionValues() {
            return this.selectedOptions.map(({ value }) => value);
        },
    },

    methods: {
        isSelected(value) {
            return this.selectedOptionValues.includes(value);
        },

        isDisabled(option) {
            return option.disabled || false;
        },

        toggleSelect(option) {
            if (this.isDisabled(option)) {
                return;
            }

            if (this.isSelected(option.value)) {
                return this.$emit('deselect', option);
            }

            this.$emit('select', option);
        },
    },
};
</script>
