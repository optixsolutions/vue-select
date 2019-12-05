import Multiselect from './components/Multiselect.vue';
import './styles/index.scss';

export default function install(Vue) {
    // Register components
    Vue.component('multiselect', Multiselect);
}
