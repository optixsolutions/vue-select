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
                            v-for="selectedOption in selectedOptions"
                            :key="selectedOption[optionIdentifier]"
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
                :scroll-throttle-wait="scrollThrottleWait"
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
                            Loading...
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

        queryChangeWait: {
            type: Number,
            default: 150,
        },

        scrollThrottleWait: {
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
    },

    watch: {
        value: {
            handler(value) {
                if (this.hasOptions) {
                    this.setSelectedOptions(value, 'value');
                }
            },
            immediate: true,
        },

        options: {
            handler() {
                this.setSelectedOptions(this.value, 'options');
            },
            deep: true,
        },

        searchQuery(searchQuery) {
            if (! this.disabled) {
                if (this.hasSearchQuery) {
                    this.showDropdown();
                }

                if (this.$refs.dropdown) {
                    this.$refs.dropdown.scrollToTop();
                }

                clearTimeout(this.searchTimeout);

                this.searchTimeout = setTimeout(() => {
                    this.$emit('query-change', searchQuery);
                }, this.queryChangeWait);
            }
        },

        selectedOptionValues(newValues, oldValues) {
            // Don't do anything if the select is disabled...
            if (this.disabled) {
                return;
            }

            if (this.multiple) {
                const diff = newValues.filter(value => {
                    return ! oldValues.includes(value);
                });

                // Don't emit input if nothing has changed...
                if (newValues.length === oldValues.length && diff.length === 0) {
                    return;
                }

                return this.$emit('input', newValues);
            }

            // Return null if nothing has been selected...
            if (newValues.length === 0) {
                return this.$emit('input', null);
            }

            // Return the first selected value...
            this.$emit('input', newValues[0]);
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
            if (! this.disabled) {
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
            }
        },

        setSelectedOptions(value) {
            if (! value) {
                return this.selectedOptions = [];
            }

            const values = Array.isArray(value) ? value : [ value ];

            this.selectedOptions = this.options.filter(selectedOption => {
                return values.includes(selectedOption[this.optionIdentifier]);
            });
        },

        setDropdownPosition() {
            if (this.openDirection === 'auto') {
                const selectRect = this.$refs.select.getBoundingClientRect();
                const dropdownRect = this.$refs.dropdown.$el.getBoundingClientRect();

                if ((selectRect.y + selectRect.height + dropdownRect.height) > window.innerHeight) {
                    return this.dropdownOpenDirection = 'up';
                }

                return this.dropdownOpenDirection = 'down';
            }

            return this.dropdownOpenDirection = this.openDirection;
        },

        activateSelect() {
            if (! this.disabled) {
                this.focusInput();
                this.showDropdown();
            }
        },

        focusInput() {
            this.$refs.input.focus();
            this.inputIsActive = true;
        },

        blurInput() {
            this.inputIsActive = false;
        },

        showDropdown() {
            if (! this.disabled && ! this.dropdownIsVisible) {
                this.dropdownIsVisible = true;

                this.$nextTick(() => {
                    this.setDropdownPosition();
                });
            }
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

        selectOption(option) {
            if (! this.disabled) {
                this.focusInput();
                this.searchQuery = '';
                this.dropdownIsVisible = false;

                this.$emit('change');
                this.$emit('select', option);

                if (this.multiple) {
                    return this.selectedOptions.push(option);
                }

                this.selectedOptions = [ option ];
            }
        },

        deselectOption(option) {
            if (! this.disabled) {
                this.dropdownIsVisible = false;

                this.$emit('change');
                this.$emit('deselect', option);

                this.selectedOptions = this.selectedOptions.filter(selectedOption => {
                    return selectedOption[this.optionIdentifier] !== option[this.optionIdentifier];
                });
            }
        },
    },
};
</script>
