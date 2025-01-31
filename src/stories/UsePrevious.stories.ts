import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UsePrevious } from './UsePrevious';

const meta = {
    title: 'Hooks/usePrevious',
    component: UsePrevious,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
A hook that tracks the previous value of a variable with history and change detection.

Features:
- Track previous values with configurable history size
- Change detection with custom comparison
- History management with clear functionality
- Empty state handling
- Keyboard support (Enter to submit)
                `,
            },
        },
    },
} satisfies Meta<typeof UsePrevious>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Get elements
        const input = canvas.getByTestId('input');
        const submitButton = canvas.getByTestId('submitButton');
        const clearButton = canvas.getByTestId('clearButton');
        const currentValue = canvas.getByTestId('currentValue');
        const previousValue = canvas.getByTestId('previousValue');
        const history = canvas.getByTestId('history');

        // Test initial state
        expect(input).toHaveValue('');
        expect(currentValue).toHaveTextContent('Current Value: (empty)');
        expect(previousValue).toHaveTextContent('Previous Value: (none)');
        expect(history).toHaveTextContent('No history available');

        // Test submitting first value
        await userEvent.type(input, 'First Value');
        await userEvent.click(submitButton);
        expect(currentValue).toHaveTextContent('Current Value: First Value');
        expect(previousValue).toHaveTextContent('Previous Value: (empty)');
        expect(history).toHaveTextContent('(empty)');
        expect(input).toHaveValue('');

        // Test submitting second value
        await userEvent.type(input, 'Second Value');
        await userEvent.click(submitButton);
        expect(currentValue).toHaveTextContent('Current Value: Second Value');
        expect(previousValue).toHaveTextContent('Previous Value: First Value');
        expect(history).toHaveTextContent('First Value');
        expect(history).toHaveTextContent('(empty)');

        // Test keyboard submission
        await userEvent.type(input, 'Third Value{enter}');
        expect(currentValue).toHaveTextContent('Current Value: Third Value');
        expect(previousValue).toHaveTextContent('Previous Value: Second Value');
        expect(history).toHaveTextContent('Second Value');
        expect(history).toHaveTextContent('First Value');
        expect(history).toHaveTextContent('(empty)');

        // Test empty value submission
        await userEvent.click(submitButton);
        expect(currentValue).toHaveTextContent('Current Value: (empty)');
        expect(previousValue).toHaveTextContent('Previous Value: Third Value');
        expect(history).toHaveTextContent('Third Value');

        // Test clearing history
        await userEvent.click(clearButton);
        expect(currentValue).toHaveTextContent('Current Value: (empty)');
        expect(previousValue).toHaveTextContent('Previous Value: (none)');
        expect(history).toHaveTextContent('No history available');

        // Test history limit
        const values = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
        for (const value of values) {
            await userEvent.type(input, value, { delay: 100 });
            await userEvent.click(submitButton);
        }
        
        // Should only show last 5 values due to maxHistory setting
        expect(currentValue).toHaveTextContent('Seven');
        expect(previousValue).toHaveTextContent('Six');
        expect(history).toHaveTextContent('Six');
        expect(history).toHaveTextContent('Five');
        expect(history).toHaveTextContent('Four');
        expect(history).toHaveTextContent('Three');
        expect(history).toHaveTextContent('Two');
        expect(history).not.toHaveTextContent('One');
    },
}; 