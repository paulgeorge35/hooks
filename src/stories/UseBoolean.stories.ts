import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UseBoolean } from './UseBoolean';

const meta = {
    title: 'Hooks/useBoolean',
    component: UseBoolean,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A hook that manages boolean state with convenient toggle and set functions.',
            },
        },
    },
} satisfies Meta<typeof UseBoolean>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Test Basic Toggle section
        const enabledStatus = canvas.getByTestId('enabledStatus');
        const toggleButton = canvas.getByTestId('toggleButton');
        const enableButton = canvas.getByTestId('enableButton');
        const disableButton = canvas.getByTestId('disableButton');
        const setTrueButton = canvas.getByTestId('setTrueButton');
        const setFalseButton = canvas.getByTestId('setFalseButton');

        // Initial state
        expect(enabledStatus).toHaveTextContent('Status: Disabled');
        expect(enableButton).toBeEnabled();
        expect(disableButton).toBeDisabled();

        // Test toggle
        await userEvent.click(toggleButton);
        expect(enabledStatus).toHaveTextContent('Status: Enabled');
        expect(enableButton).toBeDisabled();
        expect(disableButton).toBeEnabled();

        // Test setFalse
        await userEvent.click(setFalseButton);
        expect(enabledStatus).toHaveTextContent('Status: Disabled');

        // Test setTrue
        await userEvent.click(setTrueButton);
        expect(enabledStatus).toHaveTextContent('Status: Enabled');

        // Test Active State section
        const activeStatus = canvas.getByTestId('activeStatus');
        const toggleActiveButton = canvas.getByTestId('toggleActiveButton');
        const activateButton = canvas.getByTestId('activateButton');
        const deactivateButton = canvas.getByTestId('deactivateButton');

        // Initial state (true)
        expect(activeStatus).toHaveTextContent('Status: Active');
        expect(activateButton).toBeDisabled();
        expect(deactivateButton).toBeEnabled();

        // Test toggle
        await userEvent.click(toggleActiveButton);
        expect(activeStatus).toHaveTextContent('Status: Inactive');
        expect(activateButton).toBeEnabled();
        expect(deactivateButton).toBeDisabled();

        // Test Visibility section
        const visibilityStatus = canvas.getByTestId('visibilityStatus');
        const toggleVisibilityButton = canvas.getByTestId('toggleVisibilityButton');
        const showButton = canvas.getByTestId('showButton');
        const hideButton = canvas.getByTestId('hideButton');

        // Initial state (false)
        expect(visibilityStatus).toHaveTextContent('Status: Hidden');
        expect(showButton).toBeEnabled();
        expect(hideButton).toBeDisabled();

        // Test show
        await userEvent.click(showButton);
        expect(visibilityStatus).toHaveTextContent('Status: Visible');
        expect(showButton).toBeDisabled();
        expect(hideButton).toBeEnabled();

        // Test hide
        await userEvent.click(hideButton);
        expect(visibilityStatus).toHaveTextContent('Status: Hidden');
        expect(showButton).toBeEnabled();
        expect(hideButton).toBeDisabled();
    },
};


