import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseFocus } from './UseFocus';

const meta = {
    title: 'Hooks/useFocus',
    component: UseFocus,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof UseFocus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Initial state - input should be auto-focused
        const inputStatus = canvas.getByTestId('inputStatus');
        const focusableInput = canvas.getByTestId('focusableInput');
        const focusInputButton = canvas.getByTestId('focusInputButton');
        const blurInputButton = canvas.getByTestId('blurInputButton');

        const buttonStatus = canvas.getByTestId('buttonStatus');
        const focusableButton = canvas.getByTestId('focusableButton');
        const focusButtonButton = canvas.getByTestId('focusButtonButton');
        const blurButtonButton = canvas.getByTestId('blurButtonButton');

        expect(inputStatus).toHaveTextContent('Status: Not Focused');
        expect(focusableInput).not.toHaveFocus();

        // Focus input
        await userEvent.click(focusInputButton);
        expect(inputStatus).toHaveTextContent('Status: Focused');
        expect(focusableInput).toHaveFocus();

        // Focus button
        await userEvent.click(focusButtonButton);
        expect(buttonStatus).toHaveTextContent('Status: Focused');
        expect(focusableButton).toHaveFocus();
        expect(inputStatus).toHaveTextContent('Status: Not Focused');
        expect(focusableInput).not.toHaveFocus();

        // Blur button
        await userEvent.click(blurButtonButton);
        expect(buttonStatus).toHaveTextContent('Status: Not Focused');
        expect(focusableButton).not.toHaveFocus();

        // Blur input
        await userEvent.click(blurInputButton);
        expect(inputStatus).toHaveTextContent('Status: Not Focused');
        expect(focusableInput).not.toHaveFocus();
    },
};