// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

import { useBoolean } from '../index';
import { Button } from './Button';
import './index.css';

export const UseBoolean: React.FC<{ initialValue: boolean }> = ({ initialValue }) => {
  const { value, setTrue, setFalse, toggle, setValue } = useBoolean(initialValue);

  return (
    <article className="storybook-article">
      <h1 className="storybook-header">UseBoolean Default: {initialValue ? 'true' : 'false'}</h1>
      <span className='storybook-content-use-boolean'>
        <p data-testid="value">Value: {value ? 'true' : 'false'}</p>
        <div id="storybook-button-group">
          <Button id="setTrue" onClick={setTrue}>setTrue()</Button>
          <Button id="setFalse" onClick={setFalse}>setFalse()</Button>
          <Button id="toggle" onClick={toggle}>toggle()</Button>
          <Button id="setValueTrue" onClick={() => setValue(true)}>setValue(true)</Button>
          <Button id="setValueFalse" onClick={() => setValue(false)}>setValue(false)</Button>
        </div>
      </span>
    </article>
  );
};
