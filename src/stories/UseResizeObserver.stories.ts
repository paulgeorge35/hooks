import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { UseResizeObserver } from './UseResizeObserver';

const meta: Meta = {
  title: 'Hooks/useResizeObserver',
  component: UseResizeObserver,
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
    const container = canvas.getByTestId('resize-example');
    const width = canvas.getByTestId('width');
    const height = canvas.getByTestId('height');
    const borderBox = canvas.getByTestId('borderBox');
    const contentBox = canvas.getByTestId('contentBox');
    const observing = canvas.getByTestId('observing');

    // Verify all elements are present
    expect(container).toBeDefined();
    expect(width).toBeDefined();
    expect(height).toBeDefined();
    expect(borderBox).toBeDefined();
    expect(contentBox).toBeDefined();
    expect(observing).toBeDefined();

    // Wait for ResizeObserver to initialize
    await new Promise(resolve => setTimeout(resolve, 300));

    // Verify initial dimensions
    expect(container).toHaveStyle({
      width: "200px",
      height: "100px",
    });

    // Verify width and height display
    expect(width.querySelector('.value')?.textContent).toMatch(/^\d+px$/);
    expect(height.querySelector('.value')?.textContent).toMatch(/^\d+px$/);

    // Verify box sizes display
    expect(borderBox.querySelector('.value')?.textContent).toMatch(/^\d+px × \d+px$/);
    expect(contentBox.querySelector('.value')?.textContent).toMatch(/^\d+px × \d+px$/);

    // Verify observer status
    expect(observing.querySelector('.value')?.textContent).toBe('Yes');
  }
}; 