import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseNumber } from './UseNumber';

const meta = {
    title: 'Hooks/useNumber',
    component: UseNumber,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A hook for managing numeric values with increment/decrement functionality and value constraints.',
            },
        },
    },
} satisfies Meta<typeof UseNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Integer controls
        const integerValue = canvas.getByTestId('integerValue');
        const integerInput = canvas.getByTestId('integerInput') as HTMLInputElement;
        const integerIncrement = canvas.getByTestId('integerIncrement');
        const integerDecrement = canvas.getByTestId('integerDecrement');

        // Initial state check for integer
        expect(integerValue.textContent).toContain('0');
        expect(integerIncrement).not.toBeDisabled();
        expect(integerDecrement).not.toBeDisabled();

        // Test increment
        await userEvent.click(integerIncrement);
        expect(integerValue.textContent).toContain('1');

        // Test decrement
        await userEvent.click(integerDecrement);
        expect(integerValue.textContent).toContain('0');

        // Test direct input
        await userEvent.clear(integerInput);
        await userEvent.type(integerInput, '5');
        expect(integerValue.textContent).toContain('5');

        // Float controls
        const floatValue = canvas.getByTestId('floatValue');
        const floatInput = canvas.getByTestId('floatInput') as HTMLInputElement;
        const floatIncrement = canvas.getByTestId('floatIncrement');
        const floatDecrement = canvas.getByTestId('floatDecrement');

        // Initial state check for float
        expect(floatValue.textContent).toContain('0');
        expect(floatIncrement).not.toBeDisabled();
        expect(floatDecrement).not.toBeDisabled();

        // Test increment
        await userEvent.click(floatIncrement);
        expect(floatValue.textContent).toContain('0.5');

        // Test decrement
        await userEvent.click(floatDecrement);
        expect(floatValue.textContent).toContain('0');

        // Test direct input
        await userEvent.clear(floatInput);
        await userEvent.type(floatInput, '2.5');
        expect(floatValue.textContent).toContain('2.5');

        // Test bounds
        await userEvent.clear(floatInput);
        await userEvent.type(floatInput, '6', { delay: 50 });
        expect(floatValue.textContent).toContain('5.5'); // Should be clamped to max

        await userEvent.clear(floatInput);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        await userEvent.click(floatDecrement);
        expect(floatValue.textContent).toContain('-5.5'); // Should be clamped to min
        await userEvent.click(floatDecrement);
        expect(floatValue.textContent).toContain('-5.5'); // Should be clamped to min
    },
}; 