// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

import './button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
}

/** Primary UI component for user interaction */
export const Button: React.FC<ButtonProps> = ({
  id,
  primary = true,
  size = 'medium',
  backgroundColor,
  children,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      id={id}
      data-testid={id}
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {children}
    </button>
  );
};
