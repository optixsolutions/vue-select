import { mount } from '@vue/test-utils';
import Select from '../../src/components/Select';

describe('select component', () => {
    it('renders prop options when focused', async () => {
        const options = defaultOptions();
        const wrapper = factory({ options });

        wrapper.find({ ref: 'select' }).trigger('click');

        await wrapper.vm.$nextTick();

        options.forEach(option => {
            expect(wrapper.text()).toContain(option.label);
        });
    });

    it('emits the correct value when an option is selected', async () => {
        const options = defaultOptions();
        const wrapper = factory({ options });

        wrapper.find({ ref: 'select' }).trigger('click');
        await wrapper.vm.$nextTick();

        const firstRenderedOption = wrapper.find('.vs-dropdown-option');
        expect(firstRenderedOption.text()).toMatch(options[0].label);

        firstRenderedOption.trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().input[0][0]).toBe(options[0].value);
    });

    it('emmits an array of correct values when multiple prop is true an options are selected', async () => {
        const options = defaultOptions();
        const wrapper = factory({
            options,
            multiple: true,
        });

        wrapper.find({ ref: 'select' }).trigger('click');
        await wrapper.vm.$nextTick();

        const renderedOptions = wrapper.findAll('.vs-dropdown-option');
        expect(renderedOptions).toHaveLength(options.length);

        renderedOptions.trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().input[0][0]).toEqual(
            options.map(({ value }) => value),
        );
    });

    it('does not select disabled options', async () => {
        const options = [
            { value: 1, label: 'Charlie', disabled: true },
            { value: 2, label: 'Dee' },
        ];
        const wrapper = factory({ options });

        wrapper.find({ ref: 'select' }).trigger('click');
        await wrapper.vm.$nextTick();

        const renderedOptions = wrapper.findAll('.vs-dropdown-option');
        expect(renderedOptions).toHaveLength(options.length);

        renderedOptions.trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().input[0][0]).toBe(options[1].value);
    });
});

const factory = props => {
    return mount(Select, {
        propsData: props,
    });
};

const defaultOptions = () => {
    return [
        { value: 1, label: 'Charlie' },
        { value: 'dee', label: 'Dee' },
        { value: true, label: 'Dennis' },
        { value: null, label: 'Frank' },
        { value: 2, label: 'Mac' },
    ];
};
