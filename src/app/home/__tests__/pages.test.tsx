import { fireEvent, render, screen } from '../../../../test/utils/render';
import HomePage from '../pages';

jest.mock('../../../components/Header', () => () => <div data-testid="header">Header Component</div>);
jest.mock('../../../components/BrandCarousel', () => () => <nav data-testid="brandCarousel">BrandCarousel</nav>);
jest.mock('../../../components/Faq', () => () => <div data-testid="faq">FAQ</div>);
jest.mock('../../../components/CategoryGrid', () => () => <nav data-testid="categorygrid">CategoryGrid</nav>);
jest.mock('../../../components/PatnerGrid', () => () => <div data-testid="patnergrid">patnergrid</div>);
jest.mock('../../../components/Footer', () => () => <nav data-testid="footer">Footer</nav>);

jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

describe('Test homepage', () => {
  test('renders product banner with correct link and alt text', () => {
    render(<HomePage />);
    const productBanner = screen.getByRole("link", { name: /product banner/i });
    expect(productBanner).toHaveAttribute("href", "/products");

    const bannerImage = screen.getAllByAltText(/advertiment banner/i)[0];
    expect(bannerImage).toBeInTheDocument();
  });
  test("renders Sign In and Shop as Guest buttons", () => {
    render(<HomePage />);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    const guestButton = screen.getByRole("button", { name: /shop as guest/i });

    expect(signInButton).toBeInTheDocument();
    expect(guestButton).toBeInTheDocument();

    fireEvent.click(signInButton);
    fireEvent.click(guestButton);
  });
  test('renders Header, BrandCarousel, FAQ, CategoryGrid, PatnerGrid and Footer children', () => {
    render(<HomePage />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('brandCarousel')).toBeInTheDocument();
    expect(screen.getByTestId('faq')).toBeInTheDocument();
    expect(screen.getByTestId('categorygrid')).toBeInTheDocument();
    expect(screen.getByTestId('patnergrid')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
})