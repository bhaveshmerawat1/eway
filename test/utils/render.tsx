import { EmployeeProvider } from '@/context/EmployeeContext';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import "@testing-library/jest-dom";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  console.log('Rendering with AppProvider', EmployeeProvider);
  return (
    <>
      <EmployeeProvider >
      {children}
      </EmployeeProvider>
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
