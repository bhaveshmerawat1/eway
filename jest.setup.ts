import React from 'react';
import '@testing-library/jest-dom';     // RTL matchers like toBeInTheDocument
import 'whatwg-fetch';                  // fetch() in tests

// Optional: a simple next/navigation mock (you can refine per test)
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => '/test-path',
    useSearchParams: () => new URLSearchParams(''),
  };
});

// Optional: mock next/image to act like a plain img in Jest
jest.mock('next/image', () => {
  // Ensure React is in scope for JSX
  const React = require('react');
  return function Image(props: any) {
    // keep alt/src/width/height for accessibility
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props);
  };
});
