<template>
    <div class="multiselect-select-menu">
        <div class="multiselect-select-menu-inner">
            <div v-if="! hasOptions" class="multiselect-select-menu-no-options">
                {{ noOptionsMessage }}
            </div>

            <template v-else>
                <div
                    v-for="(option, index) in options"
                    :key="option.value"
                    :ref="`option-${index}`"
                    @click.stop="toggleSelectedOption(option)"
                    @mouseout="clearFocusedOption"
                    @mouseenter="setFocusedOption(option)"
                >
                    <slot
                        name="menu-option"
                        v-bind="{
                            option,
                            classes: {
                                'focused': optionIsFocused(option.value),
                                'selected': optionIsSelected(option.value),
                                'disabled': optionIsDisabled(option),
                            }
                        }"
                    />
                </div>
            </template>
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

        noOptionsMessage: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            focusedOption: null,
        };
    },

    computed: {
        selectedOptionValues() {
            return this.selectedOptions.map(({ value }) => value);
        },

        hasOptions() {
            return !! this.options.length;
        },

        hasFocusableOptions() {
            return !! this.options.filter(option => {
                return ! option.disabled;
            }).length;
        },

        focusedOptionIndex() {
            if (this.focusedOption) {
                return this.options.findIndex(({ value }) => {
                    return value === this.focusedOption.value;
                });
            }

            return null;
        },

        lastOptionIndex() {
            return this.options.length - 1;
        },
    },

    created() {
        document.addEventListener('keydown', this.keydownListener);
    },

    beforeDestroy() {
        document.removeEventListener('keydown', this.keydownListener);
    },

    methods: {
        keydownListener(e) {
            if (this.hasFocusableOptions) {
                // Enter
                if (e.keyCode === 13) {
                    this.toggleSelectedOption(
                        this.options[this.focusedOptionIndex]
                    );
                }

                // Arrow up
                if (e.keyCode === 38) {
                    const previousIndex = this.getPreviousFocusableIndex(
                        this.focusedOptionIndex
                    );

                    this.setFocusedOption(this.options[previousIndex]);
                    this.scrollToOption(previousIndex);
                }

                // Arrow down
                if (e.keyCode === 40) {
                    const nextIndex = this.getNextFocusableIndex(
                        this.focusedOptionIndex
                    );

                    this.setFocusedOption(this.options[nextIndex]);
                    this.scrollToOption(nextIndex);
                }
            }
        },

        getPreviousFocusableIndex(currentIndex) {
            if (currentIndex > 0) {
                const previousIndex = currentIndex - 1;

                if (this.optionIsDisabled(this.options[previousIndex])) {
                    return this.getPreviousFocusableIndex(previousIndex);
                }

                return previousIndex;
            }

            if (this.optionIsDisabled(this.options[0])) {
                return this.getNextFocusableIndex(0);
            }

            return 0;
        },

        getNextFocusableIndex(currentIndex) {
            if (currentIndex !== this.lastOptionIndex) {
                const nextIndex = currentIndex !== null ? currentIndex + 1 : 0;

                if (this.optionIsDisabled(this.options[nextIndex])) {
                    return this.getNextFocusableIndex(nextIndex);
                }

                return nextIndex;
            }

            if (this.optionIsDisabled(this.options[currentIndex])) {
                return this.getPreviousFocusableIndex(currentIndex);
            }

            return currentIndex;
        },

        setFocusedOption(option) {
            this.focusedOption = option;
        },

        clearFocusedOption() {
            this.focusedOption = null;
        },

        optionIsFocused(value) {
            return this.focusedOption
                && (this.focusedOption.value === value);
        },

        optionIsSelected(value) {
            return this.selectedOptionValues.includes(value);
        },

        optionIsDisabled(option) {
            return option.disabled || false;
        },

        toggleSelectedOption(option) {
            if (this.optionIsDisabled(option)) {
                return;
            }

            if (this.optionIsSelected(option.value)) {
                return this.$emit('deselect-option', option);
            }

            this.$emit('select-option', option);
        },

        scrollToOption(index) {
            this.$refs[`option-${index}`][0].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
            });
        },
    },
};
</script>
