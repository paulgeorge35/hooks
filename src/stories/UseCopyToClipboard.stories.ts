import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseCopyToClipboard } from './UseCopyToClipboard';

const meta = {
    title: 'Hooks/useCopyToClipboard',
    component: UseCopyToClipboard,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof UseCopyToClipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Initial state
        const input = canvas.getByTestId('input');
        const copyButton = canvas.getByTestId('copyButton');
        expect(input).toHaveValue('Hello, World!');
        expect(copyButton).toBeEnabled();
        expect(copyButton).toHaveTextContent('Copy');

        // Change input text
        await userEvent.clear(input);
        await userEvent.type(input, 'New text to copy');
        expect(input).toHaveValue('New text to copy');

        // Mock clipboard API
        const originalClipboard = navigator.clipboard;
        const mockClipboard = {
            writeText: async (text: string) => {
                return Promise.resolve();
            }
        };
        Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            configurable: true
        });

        // Click copy button
        await userEvent.click(copyButton);

        // Wait for copy to complete and "Copied!" message
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(copyButton).toHaveTextContent('Copied!');

        // Wait for "Copied!" message to disappear
        await new Promise(resolve => setTimeout(resolve, 2000));
        expect(copyButton).toHaveTextContent('Copy');

        // Restore original clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            configurable: true
        });
    },
};

export const WithError: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Mock clipboard API to throw error
        const originalClipboard = navigator.clipboard;
        const mockClipboard = {
            writeText: async () => {
                throw new Error('Clipboard access denied');
            }
        };
        Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            configurable: true
        });

        // Click copy button
        const copyButton = canvas.getByTestId('copyButton');
        await userEvent.click(copyButton);

        // Wait for error to appear
        await new Promise(resolve => setTimeout(resolve, 100));
        const error = canvas.getByTestId('error');
        expect(error).toHaveTextContent('Clipboard access denied');

        // Restore original clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            configurable: true
        });
    },
}; 