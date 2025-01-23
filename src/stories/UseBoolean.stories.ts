import type { Meta, StoryObj } from '@storybook/react';

import { expect, userEvent, within } from '@storybook/test';
import { UseBoolean } from './UseBoolean';

const meta = {
    title: 'Hooks/useBoolean',
    component: UseBoolean,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        initialValue: {
            control: 'boolean',
        },
    },
    args: {
        initialValue: false,
    },
} satisfies Meta<typeof UseBoolean>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        initialValue: false,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const value = canvas.getByTestId('value');
        const setTrueButton = canvas.getByTestId('setTrue');
        const setFalseButton = canvas.getByTestId('setFalse');
        const toggleButton = canvas.getByTestId('toggle');
        const setValueTrueButton = canvas.getByTestId('setValueTrue');
        const setValueFalseButton = canvas.getByTestId('setValueFalse');

        // initial value
        expect(value).toHaveTextContent('Value: false');

        await userEvent.click(setTrueButton);
        expect(value).toHaveTextContent('Value: true');
        await userEvent.click(setFalseButton);
        expect(value).toHaveTextContent('Value: false');
        await userEvent.click(toggleButton);
        expect(value).toHaveTextContent('Value: true');
        await userEvent.click(setValueTrueButton);
        expect(value).toHaveTextContent('Value: true');
        await userEvent.click(setValueFalseButton);
        expect(value).toHaveTextContent('Value: false');
    },
};

export const True: Story = {
    args: {
        initialValue: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const setTrueButton = canvas.getByTestId('setTrue');
        const setFalseButton = canvas.getByTestId('setFalse');
        const toggleButton = canvas.getByTestId('toggle');
        const setValueTrueButton = canvas.getByTestId('setValueTrue');
        const setValueFalseButton = canvas.getByTestId('setValueFalse');

        // initial value
        const value = canvas.getByTestId('value');

        expect(value).toHaveTextContent('Value: true');
        await userEvent.click(setTrueButton);
        expect(value).toHaveTextContent('Value: true');
        await userEvent.click(setFalseButton);
        expect(value).toHaveTextContent('Value: false');
        await userEvent.click(toggleButton);
        expect(value).toHaveTextContent('Value: true');
        await userEvent.click(setValueTrueButton);
        expect(value).toHaveTextContent('Value: true');
        await userEvent.click(setValueFalseButton);
        expect(value).toHaveTextContent('Value: false');
    },
};


