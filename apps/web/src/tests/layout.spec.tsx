import React from 'react';

import RootLayout from '@/app/layout';
import { render, screen } from '@testing-library/react';

describe('Root Layout', () => {
  describe('render', () => {
    it('should render', () => {
      render(
        <RootLayout>
          <div>
            <h1>Test</h1>
            <p>Test paragraph</p>
          </div>
        </RootLayout>,
      );
      screen.debug();
    });
  });
});
