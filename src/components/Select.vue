<template>
    <div class="vs-reset">
        <div
            ref="select"
            class="vs-select"
            :class="selectClass"
            @click="showDropdown"
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
                            size="2"
                            @blur="blurInput"
                            @focus="inputIsActive = true"
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
                :options="filteredOptions"
                :loading-more="loadingMore"
                :selected-options="selectedOptions"
                :option-identifier="optionIdentifier"
                :no-options-message="noOptionsMessage"
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
            default: true,
        },

        hideSelected: {
            type: Boolean,
            default: false,
        },

        placeholder: {
            type: String,
            default: 'Please select...',
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

        noOptionsMessage: {
            type: String,
            default: 'No options found.',
        },
    },

    data() {
        return {
            searchQuery: '',
            inputIsActive: false,
            selectClass: null,

            dropdownIsVisible: false,
            selectedOptions: [],
        };
    },

    computed: {
        hasValue() {
            return !! this.selectedOptions.length;
        },

        hasSearchQuery() {
            return !! this.searchQuery.length;
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

        filteredOptions() {
            let options = this.options;

            if (this.hideSelected) {
                options = options.filter(option => {
                    return ! this.selectedOptionValues.includes(
                        option[this.optionIdentifier]
                    );
                });
            }

            if (this.searchable) {
                options = options.filter(option => {
                    return option[this.optionLabel].toUpperCase().indexOf(
                        this.searchQuery.toUpperCase()
                    ) !== -1;
                });
            }

            return options;
        },
    },

    watch: {
        searchQuery(searchQuery) {
            if (this.hasSearchQuery) {
                this.showDropdown();
            }

            this.$refs.input.setAttribute('size', searchQuery.length + 2);
            this.$emit('search-change', searchQuery);
        },

        selectedOptionValues(selectedOptionValues) {
            if (this.multiple) {
                return this.$emit('input', selectedOptionValues);
            }

            return this.$emit('input', selectedOptionValues.length
                ? selectedOptionValues[0]
                : null
            );
        },
    },

    created() {
        ['click', 'touchstart'].forEach(action => {
            document.addEventListener(action, this.hideDropdown);
        });

        document.addEventListener('keydown', this.keydownListener);
    },

    destroyed() {
        ['click', 'touchstart'].forEach(action => {
            document.removeEventListener(action, this.hideDropdown);
        });

        document.removeEventListener('keydown', this.keydownListener);
    },

    methods: {
        keydownListener(e) {
            // Arrow down
            if (e.keyCode === 40 && this.inputIsActive && ! this.dropdownIsVisible) {
                this.dropdownIsVisible = true;
            }

            // Delete
            if (e.keyCode === 8 && this.inputIsActive && this.hasValue && ! this.multiple) {
                this.selectedOptions = [];
            }

            // Escape
            if (e.keyCode === 27 && this.dropdownIsVisible) {
                this.dropdownIsVisible = false;
            }
        },

        setDropdownPosition() {
            if (this.openDirection === 'auto') {
                const selectRect = this.$refs.select.getBoundingClientRect();
                const dropdownRect = this.$refs.dropdown.$el.getBoundingClientRect();

                if ((selectRect.y + selectRect.height + dropdownRect.height) > window.innerHeight) {
                    return this.selectClass = 'vs-open-up';
                }

                return this.selectClass = 'vs-open-down';
            }

            return this.selectClass = `vs-open-${this.openDirection}`;
        },

        blurInput() {
            this.searchQuery = '';
            this.inputIsActive = false;
        },

        showDropdown() {
            if (! this.dropdownIsVisible) {
                this.dropdownIsVisible = true;

                this.$nextTick(() => {
                    this.setDropdownPosition();
                    this.$refs.input.focus();
                });
            }
        },

        hideDropdown(event) {
            if (
                this.dropdownIsVisible
                && (this.$refs.select !== event.target)
                && ! this.$refs.select.contains(event.target)
            ) {
                this.dropdownIsVisible = false;
            }
        },

        selectOption(option) {
            this.searchQuery = '';
            this.dropdownIsVisible = false;
            this.$emit('select', option);

            if (this.multiple) {
                return this.selectedOptions.push(option);
            }

            this.selectedOptions = [ option ];
        },

        deselectOption(option) {
            this.dropdownIsVisible = false;
            this.$emit('deselect', option);

            this.selectedOptions = this.selectedOptions.filter(selectedOption => {
                return selectedOption[this.optionIdentifier] !== option[this.optionIdentifier];
            });
        },
    },
};
</script>