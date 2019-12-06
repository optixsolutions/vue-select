<template>
    <div class="multiselect-reset">
        <div ref="multiselect" class="multiselect-select" @click="openSelectMenu">
            <div class="multiselect-select-control">
                <div class="multiselect-value-container">
                    <div
                        v-if="! hasValue && ! hasSearchQuery"
                        class="multiselect-placeholder"
                    >
                        {{ placeholder }}
                    </div>

                    <template v-if="hasValue && multiple">
                        <div
                            v-for="selectedMenuOption in selectedMenuOptions"
                            :key="selectedMenuOption.value"
                            class="multiselect-multi-value"
                            @click.stop
                        >
                            <div class="multiselect-multi-value-label">
                                {{ selectedMenuOption.label }}
                            </div>

                            <div
                                class="multiselect-multi-value-remove"
                                @click="deselectOption(selectedMenuOption)"
                            />
                        </div>
                    </template>

                    <div
                        v-if="! hasSearchQuery && hasValue && ! multiple"
                        class="multiselect-single-value"
                    >
                        {{ firstSelectedMenuOption.label }}
                    </div>

                    <div class="multiselect-input">
                        <input
                            :id="id"
                            ref="input"
                            v-model="searchQuery"
                            size="2"
                            @focus="inputIsActive = true"
                            @blur="blurInput"
                        >
                    </div>
                </div>

                <div class="multiselect-actions">
                    <div v-if="loading" class="multiselect-loader">
                        <div v-for="i in 4" :key="i" />
                    </div>

                    <div v-if="! loading" class="multiselect-arrow" />
                </div>
            </div>

            <select-menu
                v-if="selectMenuIsOpen"
                :options="filteredOptions"
                :selected-options="selectedMenuOptions"
                :no-options-message="noOptionsMessage"
                @select-option="selectOption"
                @deselect-option="deselectOption"
            >
                <template #menu-option="{ option, classes }">
                    <slot name="menu-option" v-bind="{ option, classes }">
                        <div class="multiselect-select-menu-option" :class="classes">
                            {{ option.label }}
                        </div>
                    </slot>
                </template>
            </select-menu>
        </div>
    </div>
</template>

<script>
import SelectMenu from './SelectMenu';

export default {
    components: { SelectMenu },

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

        loading: {
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

        noOptionsMessage: {
            type: String,
            default: 'No options found',
        },
    },

    data() {
        return {
            searchQuery: '',
            inputIsActive: false,

            selectMenuIsOpen: false,
            selectedMenuOptions: [],
        };
    },

    computed: {
        hasValue() {
            return !! this.selectedMenuOptions.length;
        },

        hasSearchQuery() {
            return !! this.searchQuery.length;
        },

        selectedMenuOptionValues() {
            return this.selectedMenuOptions.map(({ value }) => value);
        },

        firstSelectedMenuOption() {
            if (! this.hasValue) {
                return null;
            }

            return this.selectedMenuOptions[0];
        },

        filteredOptions() {
            let options = this.options;

            if (this.hideSelected) {
                options = options.filter(({ value }) => {
                    return ! this.selectedMenuOptionValues.includes(value);
                });
            }

            if (this.searchable) {
                options = options.filter(({ label }) => {
                    return label.toUpperCase().indexOf(
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
                this.openSelectMenu();
            }

            this.$refs.input.setAttribute('size', searchQuery.length + 2);
            this.$emit('search-change', searchQuery);
        },

        selectedMenuOptionValues(selectedMenuOptionValues) {
            if (this.multiple) {
                return this.$emit('input', selectedMenuOptionValues);
            }

            return this.$emit('input', selectedMenuOptionValues.length
                ? selectedMenuOptionValues[0]
                : null
            );
        },
    },

    created() {
        ['click', 'touchstart'].forEach(action => {
            document.addEventListener(action, this.closeSelectMenu);
        });

        document.addEventListener('keydown', this.keydownListener);
    },

    destroyed() {
        ['click', 'touchstart'].forEach(action => {
            document.removeEventListener(action, this.closeSelectMenu);
        });

        document.removeEventListener('keydown', this.keydownListener);
    },

    methods: {
        keydownListener(e) {
            // Arrow down
            if (e.keyCode === 40 && this.inputIsActive && ! this.selectMenuIsOpen) {
                this.selectMenuIsOpen = true;
            }

            // Delete
            if (e.keyCode === 8 && this.inputIsActive && this.hasValue && ! this.multiple) {
                this.selectedMenuOptions = [];
            }

            // Escape
            if (e.keyCode === 27 && this.selectMenuIsOpen) {
                this.selectMenuIsOpen = false;
            }
        },

        blurInput() {
            this.searchQuery = '';
            this.inputIsActive = false;
        },

        openSelectMenu() {
            if (! this.selectMenuIsOpen) {
                this.selectMenuIsOpen = true;
                this.$refs.input.focus();
            }
        },

        closeSelectMenu(event) {
            if (
                this.selectMenuIsOpen
                && (this.$refs.multiselect !== event.target)
                && ! this.$refs.multiselect.contains(event.target)
            ) {
                this.selectMenuIsOpen = false;
            }
        },

        selectOption(option) {
            this.searchQuery = '';
            this.selectMenuIsOpen = false;
            this.$emit('select', option);

            if (this.multiple) {
                return this.selectedMenuOptions.push(option);
            }

            this.selectedMenuOptions = [ option ];
        },

        deselectOption(option) {
            this.selectMenuIsOpen = false;
            this.$emit('deselect', option);

            this.selectedMenuOptions = this.selectedMenuOptions.filter(({ value }) => {
                return value !== option.value;
            });
        },
    },
};
</script>
