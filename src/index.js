import VueSelect from './components/Select.vue';
import './styles/index.scss';

export default function install(Vue) {
    // Register components
    Vue.component('vue-select', VueSelect);
}
