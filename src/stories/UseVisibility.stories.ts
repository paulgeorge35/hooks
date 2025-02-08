import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { UseVisibility } from './UseVisibility';

const meta: Meta = {
  title: 'Hooks/useVisibility',
  component: UseVisibility,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if all elements are present
    const target = canvas.getByTestId('visibility-target');
    const visibilityStatus = canvas.getByTestId('visibility-status');
    const trackingStatus = canvas.getByTestId('tracking-status');

    // Verify all elements are present
    expect(target).toBeDefined();
    expect(visibilityStatus).toBeDefined();
    expect(trackingStatus).toBeDefined();

    // Verify initial state (assuming element starts as not visible)
    expect(visibilityStatus.querySelector('.value')?.textContent).toBe('Hidden');
    expect(trackingStatus.querySelector('.value')?.textContent).toBe('Active');

    // Verify CSS classes
    expect(target.className).toContain('storybook-visibility-target');
    expect(target.className).not.toContain('visible');

    // Note: We can't easily test actual visibility changes in a story test
    // as it would require scrolling simulation which isn't reliable in this context
  }
}; 