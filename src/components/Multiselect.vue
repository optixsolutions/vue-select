<template>
    <div class="multiselect-reset">
        <div ref="multiselect" class="multiselect-select" @click="openSelectMenu">
            <div class="multiselect-select-control">
                <div class="multiselect-value-container">
                    <div
                        v-if="! hasValue && ! hasSearchQuery"
                        class="multiselect-placeholder"
                    >
                        Please select
                    </div>

                    <template v-if="hasValue && isMultiple">
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
                        v-if="! hasSearchQuery && hasValue && ! isMultiple"
                        class="multiselect-single-value"
                    >
                        {{ firstSelectedMenuOption.label }}
                    </div>

                    <div class="multiselect-input">
                        <input
                            ref="input"
                            v-model="searchQuery"
                            size="2"
                            @blur="searchQuery = ''"
                        >
                    </div>
                </div>

                <div class="multiselect-actions">
                    <div class="multiselect-arrow" />
                </div>
            </div>

            <select-menu
                v-if="selectMenuIsOpen"
                :options="menuOptions"
                :selected-options="selectedMenuOptions"
                @select="selectOption"
                @deselect="deselectOption"
            />
        </div>
    </div>
</template>

<script>
import SelectMenu from './SelectMenu';

export default {
    components: { SelectMenu },

    props: {
        isMultiple: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            searchQuery: '',
            selectMenuIsOpen: false,

            menuOptions: [
                { value: 1, label: 'Jack' },
                { value: 2, label: 'Rich' },
                { value: 3, label: 'Robin' },
                { value: 4, label: 'Sam', disabled: true },
                { value: 5, label: 'James' },
                { value: 6, label: 'Gary' },
            ],

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

        firstSelectedMenuOption() {
            if (! this.hasValue) {
                return null;
            }

            return this.selectedMenuOptions[0];
        },
    },

    watch: {
        searchQuery(searchQuery) {
            if (this.hasSearchQuery) {
                this.openSelectMenu();
            }

            this.$refs.input.setAttribute('size', searchQuery.length + 2);
        },
    },

    created() {
        ['click', 'touchstart'].forEach(action => {
            document.addEventListener(action, this.closeSelectMenu);
        });
    },

    destroyed() {
        ['click', 'touchstart'].forEach(action => {
            document.removeEventListener(action, this.closeSelectMenu);
        });
    },

    methods: {
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

            if (this.isMultiple) {
                return this.selectedMenuOptions.push(option);
            }

            this.selectedMenuOptions = [ option ];
        },

        deselectOption(option) {
            this.selectMenuIsOpen = false;

            this.selectedMenuOptions = this.selectedMenuOptions.filter(({ value }) => {
                return value !== option.value;
            });
        },
    },
};
</script>
