import { createLocalVue } from '@vue/test-utils';
import VueSelect from '../../src';

describe('plugin', () => {
    let Vue;

    beforeEach(() => {
        Vue = createLocalVue();
    });

    it('will globally register the select component', () => {
        Vue.use(VueSelect);

        expect('vue-select' in Vue.options.components).toBe(true);
    });

    it('can globally register a component with a given name', () => {
        Vue.use(VueSelect, {
            componentName: 'foo-bar',
        });

        expect('vue-select' in Vue.options.components).toBe(false);
        expect('foo-bar' in Vue.options.components).toBe(true);
    });
});
