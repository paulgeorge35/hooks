import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseDebounce } from './UseDebounce';

const meta = {
    title: 'Hooks/useDebounce',
    component: UseDebounce,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof UseDebounce>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Initial state
        const input = canvas.getByTestId('input');
        const flushButton = canvas.getByTestId('flushButton');
        const cancelButton = canvas.getByTestId('cancelButton');
        const currentValue = canvas.getByTestId('currentValue');
        const debouncedValue = canvas.getByTestId('debouncedValue');
        const pendingStatus = canvas.getByTestId('pendingStatus');

        expect(input).toHaveValue('');
        expect(currentValue).toHaveTextContent('Current Value:');
        expect(debouncedValue).toHaveTextContent('Debounced Value:');
        expect(pendingStatus).toHaveTextContent('Status: idle');

        // Type in input
        await userEvent.type(input, 'Hello', {
            delay: 100,
        });
        expect(currentValue).toHaveTextContent('Current Value: Hello');
        expect(pendingStatus).toHaveTextContent('Status: pending');

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(debouncedValue).toHaveTextContent('Debounced Value: Hello');
        expect(pendingStatus).toHaveTextContent('Status: idle');
    },
};

export const WithFlush: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const input = canvas.getByTestId('input');
        const flushButton = canvas.getByTestId('flushButton');
        const debouncedValue = canvas.getByTestId('debouncedValue');
        const pendingStatus = canvas.getByTestId('pendingStatus');

        // Type in input
        await userEvent.type(input, 'Quick update', {
            delay: 100,
        });
        expect(pendingStatus).toHaveTextContent('Status: pending');

        // Click flush button
        await userEvent.click(flushButton);
        expect(debouncedValue).toHaveTextContent('Debounced Value: Quick update');
        expect(pendingStatus).toHaveTextContent('Status: idle');
    },
};

export const WithCancel: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const input = canvas.getByTestId('input');
        const cancelButton = canvas.getByTestId('cancelButton');
        const debouncedValue = canvas.getByTestId('debouncedValue');
        const pendingStatus = canvas.getByTestId('pendingStatus');

        // Type in input
        await userEvent.type(input, 'Cancelled update', {
            delay: 100,
        });
        expect(pendingStatus).toHaveTextContent('Status: pending');

        // Click cancel button
        await userEvent.click(cancelButton);
        expect(debouncedValue).not.toHaveTextContent('Cancelled update');
        expect(pendingStatus).toHaveTextContent('Status: cancelled');
    },
}; 