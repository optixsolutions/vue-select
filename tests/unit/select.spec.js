import { mount } from '@vue/test-utils';
import Select from '../../src/components/Select';

describe('select component', () => {
    it('renders prop options when focused', async () => {
        const wrapper = mount(Select, {
            propsData: {
                options: [
                    { value: 1, label: 'Foo' },
                    { value: 2, label: 'Bar' },
                ],
            },
        });

        wrapper.find({ ref: 'select' }).trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('Foo');
        expect(wrapper.text()).toContain('Bar');
    });

    it('emits the correct value when an option is selected', async () => {
        const options = [
            { value: 1, label: 'Foo' },
            { value: 2, label: 'Bar' },
        ];

        const wrapper = mount(Select, {
            propsData: { options },
        });

        wrapper.find({ ref: 'select' }).trigger('click');

        await wrapper.vm.$nextTick();

        const firstOption = wrapper.find('.vs-dropdown-option');

        expect(firstOption.text()).toMatch(options[0].label);
        firstOption.trigger('click');

        await wrapper.vm.$nextTick();

        console.log(wrapper.vm.$props.multiple);
        // expect(wrapper.emitted().input).toBe(options[0].value);
    });
});
