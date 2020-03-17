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

        expect(wrapper.emitted().input[0][0])
            .toBe(options[0].value);
    });

    it('emmits an array of correct values when multiple prop is true and an option is selected', async () => {
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

        expect(wrapper.emitted().input[0][0])
            .toEqual(
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

        expect(wrapper.emitted().input[0][0])
            .toBe(options[1].value);
    });

    it('selects a single option which is passed via the value prop', () => {
        const options = defaultOptions();
        const wrapper = factory({
            value: [ options[0].value, options[1].value ],
            options,
        });

        expect(wrapper.find({ ref: 'select' }).text())
            .toContain(options[0].label);
    });

    it('selects multiple options which are passed via the value prop when multiple prop is true', () => {
        const options = defaultOptions();
        const wrapper = factory({
            value: options.map(({ value }) => value),
            options,
            multiple: true,
        });

        options.forEach(option => {
            expect(wrapper.find({ ref: 'select' }).text())
                .toContain(option.label);
        });
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
