import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { UseMediaQuery } from './UseMediaQuery';

const meta = {
    title: 'Hooks/useMediaQuery',
    component: UseMediaQuery,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A hook that tracks whether a CSS media query matches the current window state.',
            },
        },
    },
} satisfies Meta<typeof UseMediaQuery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        // Initial state checks
        const smallScreen = canvasElement.querySelector('[data-testid="smallScreen"] .value');
        const mediumScreen = canvasElement.querySelector('[data-testid="mediumScreen"] .value');
        const largeScreen = canvasElement.querySelector('[data-testid="largeScreen"] .value');
        const darkMode = canvasElement.querySelector('[data-testid="darkMode"] .value');
        const lightMode = canvasElement.querySelector('[data-testid="lightMode"] .value');
        const reducedMotion = canvasElement.querySelector('[data-testid="reducedMotion"] .value');
        const portrait = canvasElement.querySelector('[data-testid="portrait"] .value');
        const landscape = canvasElement.querySelector('[data-testid="landscape"] .value');

        // Verify all elements are present
        expect(smallScreen).toBeDefined();
        expect(mediumScreen).toBeDefined();
        expect(largeScreen).toBeDefined();
        expect(darkMode).toBeDefined();
        expect(lightMode).toBeDefined();
        expect(reducedMotion).toBeDefined();
        expect(portrait).toBeDefined();
        expect(landscape).toBeDefined();

        // Verify that exactly one screen size is active
        const screenSizes = [
            smallScreen?.textContent === 'Yes',
            mediumScreen?.textContent === 'Yes',
            largeScreen?.textContent === 'Yes',
        ];
        expect(screenSizes.filter(Boolean).length).toBe(1);

        // Verify that exactly one orientation is active
        const orientations = [
            portrait?.textContent === 'Yes',
            landscape?.textContent === 'Yes',
        ];
        expect(orientations.filter(Boolean).length).toBe(1);

        // Verify that color scheme preferences are mutually exclusive
        const colorSchemes = [
            darkMode?.textContent === 'Yes',
            lightMode?.textContent === 'Yes',
        ];
        expect(colorSchemes.filter(Boolean).length).toBeLessThanOrEqual(1);
    },
}; 