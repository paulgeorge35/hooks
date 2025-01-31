import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseStepper } from './UseStepper';

const meta = {
    title: 'Hooks/useStepper',
    component: UseStepper,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof UseStepper>;

export default meta;
type Story = StoryObj<typeof UseStepper>;

export const Basic: Story = {
    args: {
        steps: [
            { id: 1, title: 'Personal Info' },
            { id: 2, title: 'Address' },
            { id: 3, title: 'Payment' },
            { id: 4, title: 'Review' }
        ]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Initial state
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Current Step: Personal Info');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Step Number: 0');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('First Step: Yes');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Last Step: No');

        // Test next button
        const nextButton = canvas.getByTestId('nextButton');
        await userEvent.click(nextButton);

        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Current Step: Address');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Step Number: 1');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('First Step: No');
    },
};

export const Navigation: Story = {
    args: {
        steps: [
            { id: 1, title: 'Checkout' },
            { id: 2, title: 'Shipping' },
            { id: 3, title: 'Payment' },
        ]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Test jump buttons
        const jumpButton3 = canvas.getByTestId('jumpButton-2');
        await userEvent.click(jumpButton3);

        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Current Step: Payment');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Step Number: 2');

        // Test previous button
        const prevButton = canvas.getByTestId('prevButton');
        await userEvent.click(prevButton);

        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Current Step: Shipping');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Step Number: 1');
    },
};

export const Completion: Story = {
    args: {
        steps: [
            { id: 1, title: 'Cart' },
            { id: 2, title: 'Shipping' },
            { id: 3, title: 'Payment' },
            { id: 4, title: 'Review' },
            { id: 5, title: 'Complete' }
        ]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Navigate to last step
        const jumpButton4 = canvas.getByTestId('jumpButton-4');
        await userEvent.click(jumpButton4);

        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Current Step: Complete');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Step Number: 4');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Last Step: Yes');

        // Test reset
        const resetButton = canvas.getByTestId('resetButton');
        await userEvent.click(resetButton);

        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Current Step: Cart');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('Step Number: 0');
        expect(canvas.getByTestId('stepperInfo')).toHaveTextContent('First Step: Yes');
    },
}; 