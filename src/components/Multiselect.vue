<template>
    <div class="multiselect-reset">
        <div ref="multiselect" class="multiselect-select" @click="openSelectMenu">
            <div class="multiselect-select-control">
                <div class="multiselect-value-container">
                    <!-- <div class="multiselect-single-value">
                        Jack Robertson
                    </div> -->

                    <!-- <div class="multiselect-multi-value">
                        <div class="multiselect-multi-value-label">
                            Jack Robertson
                        </div>

                        <div class="multiselect-multi-value-remove" />
                    </div>

                    <div class="multiselect-multi-value">
                        <div class="multiselect-multi-value-label">
                            Robin Meppers
                        </div>

                        <div class="multiselect-multi-value-remove" />
                    </div>

                    <div class="multiselect-multi-value">
                        <div class="multiselect-multi-value-label">
                            Rich
                        </div>

                        <div class="multiselect-multi-value-remove" />
                    </div> -->

                    <div class="multiselect-placeholder">
                        Please select
                    </div>

                    <div class="multiselect-input">
                        <input>
                    </div>
                </div>

                <div class="multiselect-actions">
                    <div class="multiselect-arrow" />
                </div>
            </div>

            <select-menu
                v-if="selectMenuIsOpen"
                :options="menuOptions"
            />
        </div>
    </div>
</template>

<script>
import SelectMenu from './SelectMenu';

export default {
    components: { SelectMenu },

    data() {
        return {
            selectMenuIsOpen: false,

            menuOptions: [
                { value: 1, label: 'Jack' },
                { value: 2, label: 'Rich' },
                { value: 3, label: 'Robin' },
                { value: 4, label: 'Sam', disabled: true },
                { value: 5, label: 'James' },
                { value: 6, label: 'Gary' },
            ],
        };
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
    },
};
</script>
