import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseStack } from './UseStack';

const meta = {
    title: 'Hooks/useStack',
    component: UseStack,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof UseStack>;

export default meta;
type Story = StoryObj<typeof UseStack>;

export const Basic: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Test single push
        const input = canvas.getByTestId('singleInput');
        const pushButton = canvas.getByTestId('pushButton');
        
        await userEvent.type(input, 'First Item');
        await userEvent.click(pushButton);
        
        expect(canvas.getByTestId('stackItems')).toHaveTextContent('First Item');
        expect(canvas.getByTestId('stackSize')).toHaveTextContent('Size: 1');
        expect(canvas.getByTestId('stackEmpty')).toHaveTextContent('Empty: No');
        expect(canvas.getByTestId('stackTop')).toHaveTextContent('Top Item: First Item');
    },
};

export const WithBatchOperations: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Test batch push
        const batchInput = canvas.getByTestId('batchInput');
        const pushManyButton = canvas.getByTestId('pushManyButton');
        
        await userEvent.type(batchInput, 'Item 1, Item 2, Item 3');
        await userEvent.click(pushManyButton);
        
        expect(canvas.getByTestId('stackItems')).toHaveTextContent('Item 1');
        expect(canvas.getByTestId('stackItems')).toHaveTextContent('Item 2');
        expect(canvas.getByTestId('stackItems')).toHaveTextContent('Item 3');
        expect(canvas.getByTestId('stackSize')).toHaveTextContent('Size: 3');
        expect(canvas.getByTestId('stackTop')).toHaveTextContent('Top Item: Item 1');

        // Test batch pop
        const popCountInput = canvas.getByTestId('popCountInput');
        const popManyButton = canvas.getByTestId('popManyButton');
        
        await userEvent.clear(popCountInput);
        await userEvent.type(popCountInput, '2');
        await userEvent.click(popManyButton);
        
        expect(canvas.getByTestId('stackItems')).not.toHaveTextContent('Item 1');
        expect(canvas.getByTestId('stackItems')).not.toHaveTextContent('Item 2');
        expect(canvas.getByTestId('stackItems')).toHaveTextContent('Item 3');
        expect(canvas.getByTestId('stackSize')).toHaveTextContent('Size: 1');
        expect(canvas.getByTestId('stackTop')).toHaveTextContent('Top Item: Item 3');
    },
};

export const WithClearAndReset: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Add some items first
        const input = canvas.getByTestId('singleInput');
        const pushButton = canvas.getByTestId('pushButton');
        
        await userEvent.type(input, 'Test Item');
        await userEvent.click(pushButton);
        
        // Test clear
        const clearButton = canvas.getByTestId('clearButton');
        await userEvent.click(clearButton);
        
        expect(canvas.getByTestId('stackItems')).toHaveTextContent('Stack is empty');
        expect(canvas.getByTestId('stackSize')).toHaveTextContent('Size: 0');
        expect(canvas.getByTestId('stackEmpty')).toHaveTextContent('Empty: Yes');
        expect(canvas.getByTestId('stackTop')).toHaveTextContent('Top Item: None');

        // Add more items and test reset
        await userEvent.type(input, 'Another Item');
        await userEvent.click(pushButton);
        
        const resetButton = canvas.getByTestId('resetButton');
        await userEvent.click(resetButton);
        
        expect(canvas.getByTestId('stackItems')).toHaveTextContent('Stack is empty');
        expect(canvas.getByTestId('stackSize')).toHaveTextContent('Size: 0');
        expect(canvas.getByTestId('stackTop')).toHaveTextContent('Top Item: None');
    },
}; 