import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseClickOutside } from './UseClickOutside';

const meta = {
    title: 'Hooks/useClickOutside',
    component: UseClickOutside,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        listenToTouchEvents: {
            control: 'boolean',
            description: 'Whether to listen for touch events',
        },
        exceptionElements: {
            control: { type: 'object' },
            description: 'Array of element tag names to exclude from click outside detection',
        },
    },
    args: {
        listenToTouchEvents: true,
        exceptionElements: [],
    },
} satisfies Meta<typeof UseClickOutside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        listenToTouchEvents: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Initial state
        const status = canvas.getByTestId('status');
        const clickCount = canvas.getByTestId('clickCount');
        const lastClickType = canvas.getByTestId('lastClickType');
        expect(status).toHaveTextContent('Status: Closed');
        expect(clickCount).toHaveTextContent('Outside Clicks: 0');
        expect(lastClickType).toHaveTextContent('Last Click Type:');

        // Open modal
        const openButton = canvas.getByTestId('openButton');
        await userEvent.click(openButton);
        expect(status).toHaveTextContent('Status: Open');

        // Click inside modal (should not close)
        const modal = canvas.getByTestId('modal');
        await userEvent.click(modal);
        expect(status).toHaveTextContent('Status: Open');

        // Click outside modal (should close)
        await userEvent.click(canvas.getByTestId('status'));
        expect(status).toHaveTextContent('Status: Closed');
        expect(clickCount).toHaveTextContent('Outside Clicks: 1');
        expect(lastClickType).toHaveTextContent('Last Click Type: click');
    },
};

export const WithExceptions: Story = {
    args: {
        listenToTouchEvents: true,
        exceptionIds: ['exceptionElement'],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Open modal
        const openButton = canvas.getByTestId('openButton');
        await userEvent.click(openButton);
        expect(canvas.getByTestId('status')).toHaveTextContent('Status: Open');

        // Click outside modal in exception element (should not close)
        const exceptionElement = document.createElement('div');
        exceptionElement.textContent = 'Exception Area';
        exceptionElement.classList.add('storybook-click-outside-exception');
        exceptionElement.setAttribute('id', 'exceptionElement');
        canvasElement.appendChild(exceptionElement);

        await userEvent.click(exceptionElement);
        expect(canvas.getByTestId('status')).toHaveTextContent('Status: Open');
        expect(canvas.getByTestId('clickCount')).toHaveTextContent('Outside Clicks: 0');

        // Click outside modal in non-exception element (should close)
        await userEvent.click(canvas.getByTestId('status'));
        expect(canvas.getByTestId('status')).toHaveTextContent('Status: Closed');
        expect(canvas.getByTestId('clickCount')).toHaveTextContent('Outside Clicks: 1');
    },
};
