import VueSelect from './components/Select.vue';

export default function install(Vue, options = {}) {
    const componentName = options.componentName || 'vue-select';

    // Register components
    Vue.component(componentName, VueSelect);
}
