export interface CheckoutUserInfo {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
}

export function validateCheckoutUser(user: Partial<CheckoutUserInfo>) {
  const errors: Partial<Record<keyof CheckoutUserInfo, string>> = {};

  if (!user.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  if (!user.email?.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)
  ) {
    errors.email = "Enter a valid email address";
  }

  if (!user.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(user.phone)) {
    errors.phone = "Phone number must be 10 digits";
  }

  return errors;
}

export function validateDeliveryDetails(data: {
  address?: string;
  city?: string;
  postalCode?: string;
}) {
  const errors: { [key: string]: string } = {};

  if (!data.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!data.city?.trim()) {
    errors.city = "City is required";
  }

  if (!data.postalCode?.trim()) {
    errors.postalCode = "Postal Code is required";
  } else if (!/^\d{5,6}$/.test(data.postalCode)) {
    errors.postalCode = "Postal Code must be 5 or 6 digits";
  }

  return errors;
}


export function validateApiDeliveryDetails(data: any) {
  const errors: Record<string, string> = {};

  if (!data.address?.trim()) errors.address = "Address is required";
  if (!data.city?.trim()) errors.city = "City is required";
  if (!data.postalCode?.trim()) errors.postalCode = "Postal Code is required";

  return errors;
}