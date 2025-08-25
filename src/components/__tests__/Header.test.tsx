import { render, screen } from '../../../test/utils/render';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

jest.mock('../HeaderDropdown', () => () => <div data-testid="header-dropdown">HeaderDropdown</div>);
jest.mock('../NavHeader', () => () => <nav data-testid="nav-header">NavHeader</nav>);

describe('Header Component', () => {
  test('renders logo with link to home', () => {
    render(<Header />);
    const logo = screen.getByRole('link', { name: /mylogo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
  });

  test('renders search input with placeholder and accepts typing', async () => {
    render(<Header />);
    const user = userEvent.setup();

    const searchInput = screen.getByRole('searchbox', {
      name: /search for all your business needs/i,
    });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('maxLength', '200');
    expect(searchInput).toHaveAttribute(
      'placeholder',
      'Search for all your business needs'
    );

    await user.type(searchInput, 'printer ink');
    expect(searchInput).toHaveValue('printer ink');
  });

  test('renders search button and can be clicked', async () => {
    render(<Header />);
    const user = userEvent.setup();
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();

    await user.click(searchButton);
    expect(searchButton).toBeEnabled();
  });

  test('renders Ink & Toner button with icon', async () => {
    render(<Header />);
    const inkButton = screen.getByRole('button', { name: /ink & toner/i });

    expect(inkButton).toBeInTheDocument();
    expect(inkButton).toHaveTextContent(/ink & toner/i);
    const icon = inkButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('renders HeaderDropdown and NavHeader children', () => {
    render(<Header />);
    expect(screen.getByTestId('header-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('nav-header')).toBeInTheDocument();
  });
});
