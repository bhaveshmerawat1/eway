import { AppProvider } from '@/context/AppContext';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import "@testing-library/jest-dom";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  console.log('Rendering with AppProvider', AppProvider);
  return (
    <>
      <AppProvider >
      {children}
      </AppProvider>
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
