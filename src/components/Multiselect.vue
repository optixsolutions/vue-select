<template>
    <div class="multiselect-reset">
        <div
            ref="multiselect"
            class="multiselect-select"
            :class="multiselectClass"
            @click="openSelectMenu"
        >
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
                            v-for="selectedOption in selectedOptions"
                            :key="selectedOption[optionIdentifier]"
                            class="multiselect-multi-value"
                            @click.stop
                        >
                            <div class="multiselect-multi-value-label">
                                {{ selectedOption[optionLabel] }}
                            </div>

                            <div
                                class="multiselect-multi-value-remove"
                                @click="deselectOption(selectedOption)"
                            />
                        </div>
                    </template>

                    <div
                        v-if="! hasSearchQuery && hasValue && ! multiple"
                        class="multiselect-single-value"
                    >
                        {{ firstSelectedOption[optionLabel] }}
                    </div>

                    <div class="multiselect-input">
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

                <div class="multiselect-actions">
                    <div v-if="loading" class="multiselect-loader">
                        <div v-for="i in 4" :key="i" />
                    </div>

                    <div v-if="! loading" class="multiselect-arrow" />
                </div>
            </div>

            <select-menu
                v-if="selectMenuIsOpen"
                ref="multiselectMenu"
                :options="filteredOptions"
                :selected-options="selectedOptions"
                :option-identifier="optionIdentifier"
                :no-options-message="noOptionsMessage"
                @select-option="selectOption"
                @deselect-option="deselectOption"
            >
                <template #menu-option="{ option, classes }">
                    <slot name="menu-option" v-bind="{ option, classes }">
                        <div class="multiselect-select-menu-option" :class="classes">
                            {{ option[optionLabel] }}
                        </div>
                    </slot>
                </template>
            </select-menu>
        </div>
    </div>
</template>

<script>
import SelectMenu from './SelectMenu';

// const throttle = (callback, limit) => {
//     let wait = false;

//     return () => {
//         if (! wait) {
//             callback.call();
//             wait = true;

//             setTimeout(() => {
//                 wait = false;
//             }, limit);
//         }
//     };
// };

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
            multiselectClass: null,

            selectMenuIsOpen: false,
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
                this.openSelectMenu();
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
                this.selectedOptions = [];
            }

            // Escape
            if (e.keyCode === 27 && this.selectMenuIsOpen) {
                this.selectMenuIsOpen = false;
            }
        },

        setMenuPosition() {
            if (this.openDirection === 'auto') {
                const selectRect = this.$refs.multiselect.getBoundingClientRect();
                const menuRect = this.$refs.multiselectMenu.$el.getBoundingClientRect();

                if (
                    (selectRect.y + selectRect.height + menuRect.height)
                    > window.innerHeight
                ) {
                    return this.multiselectClass = 'multiselect-open-up';
                }

                return this.multiselectClass = 'multiselect-open-down';
            }

            return this.multiselectClass = `multiselect-open-${this.openDirection}`;
        },

        blurInput() {
            this.searchQuery = '';
            this.inputIsActive = false;
        },

        openSelectMenu() {
            if (! this.selectMenuIsOpen) {
                this.selectMenuIsOpen = true;

                this.$nextTick(() => {
                    this.setMenuPosition();
                    this.$refs.input.focus();
                });
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
                return this.selectedOptions.push(option);
            }

            this.selectedOptions = [ option ];
        },

        deselectOption(option) {
            this.selectMenuIsOpen = false;
            this.$emit('deselect', option);

            this.selectedOptions = this.selectedOptions.filter(selectedOption => {
                return selectedOption[this.optionIdentifier] !== option[this.optionIdentifier];
            });
        },
    },
};
</script>
