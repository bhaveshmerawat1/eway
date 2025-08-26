import { fireEvent, render, screen } from '../../../test/utils/render';
import userEvent from '@testing-library/user-event';
import HeaderDropdown from '../HeaderDropdown';

describe('Header dropdown Component', () => {

  test('renders drop down menu list', async () => {
    render(<HeaderDropdown />);
    const authUser = false;
    if (!authUser) {
      const user = userEvent.setup();
      expect(screen.getByRole('button', { name: /signin/i })).toBeInTheDocument();
      const signButton = screen.getByRole('button', { name: /signin/i });
      await user.click(signButton);
      expect(screen.getByRole('button', { name: /signin/i })).toBeInTheDocument();
    } else {
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    }
  });

  test("opens dropdown when Sign in is clicked", () => {
    render(<HeaderDropdown />);
    fireEvent.click(screen.getByTestId("signinBtn"));
    expect(screen.getByTestId("userId")).toBeInTheDocument();
  });

  test("calls handleSubmit on form submission", async () => {
    const user = userEvent.setup();
    render(<HeaderDropdown />);
    fireEvent.click(screen.getByTestId("signinBtn"));
    await user.type(screen.getByTestId("userId"), "12345");
    await user.type(screen.getByLabelText("password"), "password@123");
    await user.type(screen.getByLabelText("toggle password visibility"), "true");
    await user.type(screen.getByLabelText("saveUserId"), "true");
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  });

});
