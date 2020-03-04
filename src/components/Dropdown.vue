<template>
    <div class="vs-dropdown">
        <div ref="scrollContent" class="vs-dropdown-scroll">
            <div v-if="! hasOptions" class="vs-dropdown-no-options">
                {{ noOptionsMessage }}
            </div>

            <template v-else>
                <div
                    v-for="(option, index) in options"
                    :key="option[optionIdentifier]"
                    :ref="`option-${index}`"
                    @click.stop="toggleSelectedOption(option)"
                    @mouseout="clearFocusedOption"
                    @mouseenter="setFocusedOption(option)"
                >
                    <slot
                        name="dropdown-option"
                        v-bind="{
                            option,
                            classes: {
                                'focused': optionIsFocused(option[optionIdentifier]),
                                'selected': optionIsSelected(option[optionIdentifier]),
                                'disabled': optionIsDisabled(option),
                            }
                        }"
                    />
                </div>
            </template>

            <slot
                v-if="loadingMore"
                name="dropdown-loader"
            />
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

        optionIdentifier: {
            type: [ String, Number ],
            required: true,
        },

        selectedOptions: {
            type: Array,
            default: () => [],
        },

        loadingMore: {
            type: Boolean,
            default: false,
        },

        multiple: {
            type: Boolean,
            required: true,
        },

        scrollThrottleWait: {
            type: Number,
            required: true,
        },

        loadMoreThreshold: {
            type: Number,
            required: true,
        },

        noOptionsMessage: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            focusedOption: null,

            lastScroll: 0,
            scrollableHeight: 0,
            throttlingScroll: false,
        };
    },

    computed: {
        selectedOptionValues() {
            return this.selectedOptions.map(option => {
                return option[this.optionIdentifier];
            });
        },

        hasOptions() {
            return this.options.length !== 0;
        },

        focusableOptions() {
            return this.options.filter(option => {
                return ! option.disabled;
            });
        },

        hasFocusableOptions() {
            return this.focusableOptions.length !== 0;
        },

        focusedOptionIndex() {
            if (this.focusedOption) {
                return this.options.findIndex(option => {
                    return option[this.optionIdentifier] === this.focusedOption[this.optionIdentifier];
                });
            }

            return null;
        },

        lastOptionIndex() {
            return this.options.length - 1;
        },
    },

    watch: {
        options: {
            handler() {
                this.lastScroll = 0;
                this.setScrollableHeight();
            },
            deep: true,
        },

        throttlingScroll(throttlingScroll) {
            if (! throttlingScroll) {
                const currentScroll = this.$refs.scrollContent.scrollTop;

                if (! this.throttlingScroll) {
                    if (
                        ! this.loadingMore
                        && currentScroll > this.lastScroll
                        && (this.scrollableHeight - currentScroll) < this.loadMoreThreshold
                    ) {
                        this.lastScroll = currentScroll;

                        this.$emit('load-more');
                    }
                }
            }
        },
    },

    created() {
        document.addEventListener('keydown', this.keydownListener);
    },

    mounted() {
        this.$refs.scrollContent.addEventListener('scroll', this.throttleScroll);

        this.setScrollableHeight();

        if (this.hasFocusableOptions) {
            this.setFocusedOption(this.focusableOptions[0]);
        }
    },

    beforeDestroy() {
        document.removeEventListener('keydown', this.keydownListener);
        this.$refs.scrollContent.removeEventListener('keydown', this.throttleScroll);
    },

    methods: {
        keydownListener(e) {
            if (this.hasFocusableOptions) {
                // Enter
                if (e.keyCode === 13) {
                    e.preventDefault();

                    if (this.focusableOptions.length === 1) {
                        return this.toggleSelectedOption(
                            this.focusableOptions[0],
                        );
                    }

                    return this.toggleSelectedOption(
                        this.options[this.focusedOptionIndex],
                    );
                }

                // Arrow up
                if (e.keyCode === 38) {
                    const previousIndex = this.getPreviousFocusableIndex(
                        this.focusedOptionIndex,
                    );

                    this.setFocusedOption(this.options[previousIndex]);
                    this.scrollToOption(previousIndex);
                }

                // Arrow down
                if (e.keyCode === 40) {
                    const nextIndex = this.getNextFocusableIndex(
                        this.focusedOptionIndex,
                    );

                    this.setFocusedOption(this.options[nextIndex]);
                    this.scrollToOption(nextIndex);
                }
            }
        },

        setScrollableHeight() {
            this.scrollableHeight = (
                this.$refs.scrollContent.scrollHeight - this.$refs.scrollContent.clientHeight
            );
        },

        throttleScroll() {
            if (! this.throttlingScroll) {
                this.throttlingScroll = true;

                setTimeout(() => {
                    this.throttlingScroll = false;
                }, this.scrollThrottleWait);
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
                && (this.focusedOption[this.optionIdentifier] === value);
        },

        optionIsSelected(value) {
            return this.selectedOptionValues.includes(value);
        },

        optionIsDisabled(option) {
            return option.disabled || false;
        },

        toggleSelectedOption(option) {
            if (option) {
                if (this.optionIsDisabled(option)) {
                    return;
                }

                if (
                    this.optionIsSelected(option[this.optionIdentifier])
                    && this.multiple
                ) {
                    return this.$emit('deselect-option', option);
                }

                this.$emit('select-option', option);
            }
        },

        scrollToTop() {
            this.$refs.scrollContent.scrollTo(0, 0);
        },

        scrollToOption(index) {
            this.$refs[`option-${index}`][0].scrollIntoView({
                block: 'nearest',
                inline: 'start',
            });
        },
    },
};
</script>
