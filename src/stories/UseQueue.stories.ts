import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseQueue } from './UseQueue';

const meta = {
    title: 'Hooks/useQueue',
    component: UseQueue,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof UseQueue>;

export default meta;
type Story = StoryObj<typeof UseQueue>;

export const Basic: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Test single enqueue
        const input = canvas.getByTestId('singleInput');
        const enqueueButton = canvas.getByTestId('enqueueButton');
        
        await userEvent.type(input, 'First Item');
        await userEvent.click(enqueueButton);
        
        expect(canvas.getByTestId('queueItems')).toHaveTextContent('First Item');
        expect(canvas.getByTestId('queueSize')).toHaveTextContent('Size: 1');
        expect(canvas.getByTestId('queueEmpty')).toHaveTextContent('Empty: No');
    },
};

export const WithBatchOperations: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Test batch enqueue
        const batchInput = canvas.getByTestId('batchInput');
        const enqueueManyButton = canvas.getByTestId('enqueueManyButton');
        
        await userEvent.type(batchInput, 'Item 1, Item 2, Item 3');
        await userEvent.click(enqueueManyButton);
        
        expect(canvas.getByTestId('queueItems')).toHaveTextContent('Item 1');
        expect(canvas.getByTestId('queueItems')).toHaveTextContent('Item 2');
        expect(canvas.getByTestId('queueItems')).toHaveTextContent('Item 3');
        expect(canvas.getByTestId('queueSize')).toHaveTextContent('Size: 3');

        // Test batch dequeue
        const dequeueCountInput = canvas.getByTestId('dequeueCountInput');
        const dequeueManyButton = canvas.getByTestId('dequeueManyButton');
        
        await userEvent.clear(dequeueCountInput);
        await userEvent.type(dequeueCountInput, '2');
        await userEvent.click(dequeueManyButton);
        
        expect(canvas.getByTestId('queueItems')).not.toHaveTextContent('Item 1');
        expect(canvas.getByTestId('queueItems')).not.toHaveTextContent('Item 2');
        expect(canvas.getByTestId('queueItems')).toHaveTextContent('Item 3');
        expect(canvas.getByTestId('queueSize')).toHaveTextContent('Size: 1');
    },
};

export const WithClearAndReset: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Add some items first
        const input = canvas.getByTestId('singleInput');
        const enqueueButton = canvas.getByTestId('enqueueButton');
        
        await userEvent.type(input, 'Test Item');
        await userEvent.click(enqueueButton);
        
        // Test clear
        const clearButton = canvas.getByTestId('clearButton');
        await userEvent.click(clearButton);
        
        expect(canvas.getByTestId('queueItems')).toHaveTextContent('Queue is empty');
        expect(canvas.getByTestId('queueSize')).toHaveTextContent('Size: 0');
        expect(canvas.getByTestId('queueEmpty')).toHaveTextContent('Empty: Yes');

        // Add more items and test reset
        await userEvent.type(input, 'Another Item');
        await userEvent.click(enqueueButton);
        
        const resetButton = canvas.getByTestId('resetButton');
        await userEvent.click(resetButton);
        
        expect(canvas.getByTestId('queueItems')).toHaveTextContent('Queue is empty');
        expect(canvas.getByTestId('queueSize')).toHaveTextContent('Size: 0');
    },
}; 