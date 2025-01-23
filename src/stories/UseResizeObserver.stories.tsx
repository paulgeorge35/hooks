// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { useResizeObserver } from '../useResizeObserver';

const meta: Meta = {
  title: 'Hooks/useResizeObserver',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

const ResizeExample: React.FC = () => {
  const { ref, dimensions: { width, height } } = useResizeObserver<HTMLDivElement>();

  return (
    <div style={{ padding: 20 }}>
      <div
        data-testid="resize-example"
        ref={ref}
        style={{
          resize: 'both',
          overflow: 'auto',
          padding: 20,
          width: 200,
          height: 100,
          border: '2px solid #ccc',
          backgroundColor: '#f0f0f0',
        }}
      >
        <p>Resize me using the bottom-right corner!</p>
        <p data-testid="width">Width: {Math.round(width)}px</p>
        <p data-testid="height">Height: {Math.round(height)}px</p>
      </div>
    </div>
  );
};

export const Basic: Story = {
  render: () => <ResizeExample />,
  play: async ({ canvasElement }) => {

    const simlulateResize = ({ w, h }: { w: number, h: number }) => {
      Object.assign(container.style, {
        width: `${w}px`,
        height: `${h}px`,
      });
    }
    const canvas = within(canvasElement);

    const container = canvas.getByTestId('resize-example');
    const width = canvas.getByTestId('width');
    const height = canvas.getByTestId('height');

    simlulateResize({ w: 200, h: 100 });

    expect(container).toHaveStyle({
      width: "200px",
      height: "100px",
    });

    expect(width).toHaveTextContent("Width: 200px");
    expect(height).toHaveTextContent("Height: 100px");
  }
};