import { render, screen } from '../../../test/utils/render';
import userEvent from '@testing-library/user-event';
import NavHeader from '../NavHeader';

describe('Nav header Component', () => {
  test('renders all top-level menu items', () => {
    render(<NavHeader />);
    expect(screen.getByRole('button', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /service&solution/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /brands/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deals/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publications/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });

  test('opens and closes Products menu', async () => {
    const user = userEvent.setup();
    render(<NavHeader />);

    const productsButton = screen.getByRole('button', { name: /products/i });

    // Initially closed
    expect(screen.queryByRole('button', { name: /closemenu/i })).not.toBeInTheDocument();

    // Open
    await user.click(productsButton);
    expect(screen.getByRole('button', { name: /closemenu/i })).toBeInTheDocument();

    // Close via X button
    await user.click(screen.getByRole('button', { name: /closemenu/i }));
    expect(screen.queryByRole('button', { name: /closemenu/i })).not.toBeInTheDocument();
  });

  test('clicking other menu items toggles them active', async () => {
    const user = userEvent.setup();
    render(<NavHeader />);

    const serviceButton = screen.getByRole('button', { name: /service&solution/i });
    await user.click(serviceButton);
    expect(serviceButton).toHaveClass('text-red-600');

    const brandsButton = screen.getByRole('button', { name: /brands/i });
    await user.click(brandsButton);
    expect(brandsButton).toHaveClass('text-red-600');

    const dealsButton = screen.getByRole('button', { name: /deals/i });
    await user.click(dealsButton);
    expect(dealsButton).toHaveClass('text-red-600');

    const publictionButton = screen.getByRole('button', { name: /Publications/i });
    await user.click(publictionButton);
    expect(publictionButton).toHaveClass('text-red-600');
  });
});
