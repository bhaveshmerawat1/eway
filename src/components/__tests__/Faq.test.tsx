import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FAQ from '../Faq';

describe('FAQ Component', () => {
  it('renders FAQ component', () => {
    render(<FAQ />);
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('displays subscription cancellation FAQ', () => {
    render(<FAQ />);
    expect(screen.getByText('How can I cancel my subscription?')).toBeInTheDocument();
  });

  it('toggles subscription FAQ answer when clicked', () => {
    render(<FAQ />);
    const subscriptionQuestion = screen.getByText('How can I cancel my subscription?');
    
    // Click to open
    fireEvent.click(subscriptionQuestion);
    
    // Check if answer is displayed
    expect(screen.getByText(/We're sorry to see you go!/)).toBeInTheDocument();
    expect(screen.getByText(/Sign in to your account/)).toBeInTheDocument();
  });

  it('displays all FAQ items', () => {
    render(<FAQ />);
    
    // Check for some of the expected FAQ questions
    expect(screen.getByText('Why move to a new website?')).toBeInTheDocument();
    expect(screen.getByText('How can I cancel my subscription?')).toBeInTheDocument();
  });
});
