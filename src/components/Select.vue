<template>
    <div class="vs-reset">
        <div
            ref="select"
            class="vs-select"
            :class="selectClasses"
            @click="activateSelect"
        >
            <div class="vs-select-control">
                <div class="vs-select-container">
                    <div
                        v-if="! hasValue && ! hasSearchQuery"
                        class="vs-select-placeholder"
                    >
                        {{ placeholder }}
                    </div>

                    <template v-if="hasValue && multiple">
                        <div
                            v-for="(selectedOption, index) in selectedOptions"
                            :key="index"
                            class="vs-select-multiple-value"
                            @click.stop
                        >
                            <div class="vs-select-multiple-value-label">
                                {{ selectedOption[optionLabel] }}
                            </div>

                            <div
                                class="vs-select-multiple-value-remove"
                                @click="deselectOption(selectedOption)"
                            />
                        </div>
                    </template>

                    <div
                        v-if="! hasSearchQuery && hasValue && ! multiple"
                        class="vs-select-single-value"
                    >
                        {{ firstSelectedOption[optionLabel] }}
                    </div>

                    <div class="vs-select-input">
                        <input
                            :id="id"
                            ref="input"
                            v-model="searchQuery"
                            type="text"
                            :size="(disabled || ! searchable) ? 2 : null"
                            :readonly="disabled || ! searchable"
                            :tabindex="disabled ? -1 : 0"
                            autocomplete="off"
                            @blur="blurInput"
                            @focus="activateSelect"
                        >
                    </div>
                </div>

                <div class="vs-select-actions">
                    <div v-if="loading" class="vs-select-loader">
                        <div v-for="i in 4" :key="i" />
                    </div>

                    <div
                        v-else
                        class="vs-select-arrow"
                    />
                </div>
            </div>

            <select-dropdown
                v-if="dropdownIsVisible"
                ref="dropdown"
                :options="options"
                :multiple="multiple"
                :loading-more="loadingMore"
                :selected-options="selectedOptions"
                :option-identifier="optionIdentifier"
                :no-options-message="noOptionsMessage"
                :scroll-throttle-delay="scrollThrottleDelay"
                :load-more-threshold="loadMoreThreshold"
                @load-more="$emit('load-more')"
                @select-option="selectOption"
                @deselect-option="deselectOption"
            >
                <template #dropdown-option="{ option, classes }">
                    <slot name="dropdown-option" v-bind="{ option, classes }">
                        <div class="vs-dropdown-option" :class="classes">
                            {{ option[optionLabel] }}
                        </div>
                    </slot>
                </template>

                <template #dropdown-loader>
                    <slot name="dropdown-loader">
                        <div class="vs-dropdown-loader">
                            <div class="vs-loader-dots">
                                Loading
                            </div>
                        </div>
                    </slot>
                </template>
            </select-dropdown>
        </div>
    </div>
</template>

<script>
import SelectDropdown from './Dropdown.vue';

export default {
    components: { SelectDropdown },

    props: {
        value: {
            type: [ String, Number, Array ],
            default: () => [],
        },

        id: {
            type: String,
            default: null,
        },

        options: {
            type: Array,
            default: () => [],
        },

        optionIdentifier: {
            type: [ String, Number],
            default: 'value',
        },

        optionLabel: {
            type: String,
            default: 'label',
        },

        loading: {
            type: Boolean,
            default: false,
        },

        loadingMore: {
            type: Boolean,
            default: false,
        },

        multiple: {
            type: Boolean,
            default: false,
        },

        searchable: {
            type: Boolean,
            default: false,
        },

        placeholder: {
            type: String,
            default: 'Please select...',
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        openDirection: {
            type: String,
            default: 'auto',
            validator(value) {
                return [
                    'auto', 'down', 'up',
                ].indexOf(value) !== -1;
            },
        },

        closeOnSelect: {
            type: Boolean,
            default: null,
        },

        searchDebounceDelay: {
            type: Number,
            default: 150,
        },

        scrollThrottleDelay: {
            type: Number,
            default: 150,
        },

        loadMoreThreshold: {
            type: Number,
            default: 60,
        },

        noOptionsMessage: {
            type: String,
            default: 'No options found.',
        },
    },

    data() {
        return {
            searchQuery: '',
            inputIsActive: false,
            dropdownIsVisible: false,
            dropdownOpenDirection: 'down',
            selectedOptions: [],

            searchTimeout: null,
        };
    },

    computed: {
        selectClasses() {
            return {
                disabled: this.disabled,
                'vs-open-up': this.dropdownOpenDirection === 'up',
                'vs-open-down': this.dropdownOpenDirection === 'down',
            };
        },

        hasValue() {
            return this.selectedOptions.length !== 0;
        },

        hasOptions() {
            return this.options.length !== 0;
        },

        hasSearchQuery() {
            return this.searchQuery.length !== 0;
        },

        selectedOptionValues() {
            return this.selectedOptions.map(option => {
                return option[this.optionIdentifier];
            });
        },

        firstSelectedOption() {
            if (! this.hasValue) {
                return null;
            }

            return this.selectedOptions[0];
        },

        hideDropdownOnSelect() {
            if (this.closeOnSelect === null) {
                return ! this.multiple;
            }

            return this.closeOnSelect;
        },
    },

    watch: {
        value: {
            handler(values) {
                if (! this.hasOptions) {
                    return;
                }

                if (! this.selectedOptionValues) {
                    this.setSelectedOptions(values);
                    return;
                }

                if (! Array.isArray(values)) {
                    values = [ values ];
                }

                const diff = values.filter(value => {
                    return ! this.selectedOptionValues.includes(value);
                });

                // Don't set select options if nothing has changed...
                if (values.length === this.selectedOptionValues.length && diff.length === 0) {
                    return;
                }

                this.setSelectedOptions(values);
            },
            immediate: true,
        },

        options: {
            handler() {
                if (this.options.length === 0) {
                    this.setSelectedOptions(this.value);
                }
            },
            deep: true,
        },

        searchQuery(searchQuery) {
            if (this.disabled) {
                return;
            }

            if (this.hasSearchQuery) {
                this.showDropdown();
            }

            if (this.$refs.dropdown) {
                this.$refs.dropdown.scrollToTop();
            }

            this.emitSearchQuery(searchQuery);
        },

        selectedOptionValues(values) {
            // Don't do anything if the select is disabled...
            if (this.disabled) {
                return;
            }

            if (this.multiple) {
                return this.$emit('input', values);
            }

            // Return null if nothing has been selected...
            if (values.length === 0) {
                return this.$emit('input', null);
            }

            // Return the first selected value...
            this.$emit('input', values[0]);
        },
    },

    created() {
        ['click', 'touchstart'].forEach(action => {
            document.addEventListener(action, this.deactivateSelectOnClick);
        });

        document.addEventListener('keydown', this.keydownListener);
    },

    destroyed() {
        ['click', 'touchstart'].forEach(action => {
            document.removeEventListener(action, this.deactivateSelectOnClick);
        });

        document.removeEventListener('keydown', this.keydownListener);
    },

    methods: {
        keydownListener(e) {
            if (this.disabled) {
                return;
            }

            // Arrow down
            if (e.keyCode === 40 && this.inputIsActive && ! this.dropdownIsVisible) {
                this.dropdownIsVisible = true;
            }

            // Delete
            if (e.keyCode === 8 && this.inputIsActive && this.hasValue && ! this.multiple) {
                this.selectedOptions = [];
            }

            // Tab, Escape
            if ((e.keyCode === 9 || e.keyCode === 27) && this.dropdownIsVisible) {
                this.dropdownIsVisible = false;
            }
        },

        setSelectedOptions(values) {
            if (! Array.isArray(values)) {
                values = [ values ];
            }

            if (values.length === 0) {
                this.selectedOptions = [];
                return;
            }

            let options = [ ...this.options ];
            let optionsCache = {};
            let selectedOptions = [];

            values.forEach(value => {
                const cachedOption = optionsCache[value];

                if (cachedOption) {
                    selectedOptions.push(this.formatSelectedOption(cachedOption));
                    return;
                }

                options.some((option, index) => {
                    optionsCache[option[this.optionIdentifier]] = { ...option };

                    if (option[this.optionIdentifier] === value) {
                        selectedOptions.push(this.formatSelectedOption(option));

                        // Remove all options before current index...
                        options.splice(0, index + 1);
                        return true;
                    }
                });
            });

            this.selectedOptions = selectedOptions;
        },

        setDropdownPosition() {
            if (this.openDirection === 'auto') {
                const selectRect = this.$refs.select.getBoundingClientRect();
                const dropdownRect = this.$refs.dropdown.$el.getBoundingClientRect();

                if ((selectRect.y + selectRect.height + dropdownRect.height) > window.innerHeight) {
                    this.dropdownOpenDirection = 'up';
                    return;
                }

                this.dropdownOpenDirection = 'down';
                return;
            }

            this.dropdownOpenDirection = this.openDirection;
        },

        activateSelect() {
            if (this.disabled) {
                return;
            }

            this.focusInput();
            this.showDropdown();
        },

        focusInput() {
            this.$refs.input.focus();
            this.inputIsActive = true;
        },

        blurInput() {
            this.inputIsActive = false;
        },

        showDropdown() {
            if (this.disabled || this.dropdownIsVisible) {
                return;
            }

            this.dropdownIsVisible = true;

            this.$nextTick(() => {
                this.setDropdownPosition();
            });
        },

        deactivateSelectOnClick(event) {
            if (
                this.dropdownIsVisible
                && (this.$refs.select !== event.target)
                && ! this.$refs.select.contains(event.target)
            ) {
                this.searchQuery = '';
                this.inputIsActive = false;
                this.dropdownIsVisible = false;
            }
        },

        formatSelectedOption(option) {
            return {
                [this.optionIdentifier]: option[this.optionIdentifier],
                [this.optionLabel]: option[this.optionLabel],
            };
        },

        selectOption(option) {
            if (this.disabled) {
                return;
            }

            if (this.hideDropdownOnSelect) {
                this.focusInput();
                this.searchQuery = '';
                this.dropdownIsVisible = false;
            }

            this.$emit('change');
            this.$emit('select', option);

            if (this.multiple) {
                this.selectedOptions.push(option);
                return;
            }

            this.selectedOptions = [ option ];
        },

        deselectOption(option) {
            if (this.disabled) {
                return;
            }

            if (this.hideDropdownOnSelect) {
                this.dropdownIsVisible = false;
            }

            this.$emit('change');
            this.$emit('deselect', option);

            this.selectedOptions = this.selectedOptions.filter(selectedOption => {
                return selectedOption[this.optionIdentifier] !== option[this.optionIdentifier];
            });
        },

        emitSearchQuery(searchQuery) {
            if (this.searchDebounceDelay <= 0) {
                this.$emit('query-change', searchQuery);
                return;
            }

            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                this.$emit('query-change', searchQuery);
            }, this.searchDebounceDelay);
        }
    },
};
</script>
