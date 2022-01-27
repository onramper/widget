import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layer2Provider } from '../src';
import describe from 'jest';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Layer2Provider>
        <div>hello</div>
      </Layer2Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
