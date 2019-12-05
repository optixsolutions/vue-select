import Multiselect from './components/Multiselect.vue';

export default function install(Vue, options = {}) {
    // Register components
    Vue.component('multiselect', Multiselect);
}
