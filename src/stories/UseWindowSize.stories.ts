import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { UseWindowSize } from './UseWindowSize';

const meta: Meta = {
  title: 'Hooks/useWindowSize',
  component: UseWindowSize,
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
    const width = canvas.getByTestId('width');
    const height = canvas.getByTestId('height');
    const landscape = canvas.getByTestId('landscape');
    const portrait = canvas.getByTestId('portrait');
    const aspectRatio = canvas.getByTestId('aspectRatio');

    // Verify all elements are present
    expect(width).toBeDefined();
    expect(height).toBeDefined();
    expect(landscape).toBeDefined();
    expect(portrait).toBeDefined();
    expect(aspectRatio).toBeDefined();

    // Verify that width and height are numbers followed by 'px'
    expect(width.querySelector('.value')?.textContent).toMatch(/^\d+px$/);
    expect(height.querySelector('.value')?.textContent).toMatch(/^\d+px$/);

    // Verify that exactly one orientation is active
    const orientations = [
      landscape.querySelector('.value')?.textContent === 'Yes',
      portrait.querySelector('.value')?.textContent === 'Yes',
    ];
    expect(orientations.filter(Boolean).length).toBe(1);

    // Verify that aspect ratio is a valid number
    const ratio = Number.parseFloat(aspectRatio.querySelector('.value')?.textContent || '0');
    expect(ratio).toBeGreaterThan(0);
  }
}; 