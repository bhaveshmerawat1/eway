import { Employee, NewEmployee } from "@/utils/EmployeeTypes";

export function validateEmployee(
  e: Partial<NewEmployee | Employee>,
  existing: Employee[] = [],
  isEdit: boolean = false
) {
  const errors: Partial<Record<keyof NewEmployee, string>> = {};

  if (!e.firstName?.trim()) errors.firstName = "First name is required";
  if (!e.lastName?.trim()) errors.lastName = "Last name is required";

  const ageNum = Number(e.age);
  if (!Number.isFinite(ageNum) || ageNum < 16 || ageNum > 80)
    errors.age = "Age must be between 16 and 80";

  if (!e.joinedAt) errors.joinedAt = "Joining date is required";
  if (!e.address?.trim()) errors.address = "Address is required";

  if (!e.mobile?.trim()) {
    errors.mobile = "Mobile is required";
  } else if (!/^\D*(\d\D*){10}$/.test(e.mobile)) {
    errors.mobile = "Invalid phone number. Must contain exactly 10 digits.";
  } else {
    // Uniqueness check
    const duplicate = existing.find(
      emp => emp.mobile === e.mobile && (!isEdit || emp.id !== (e as Employee).id)
    );
    if (duplicate) {
      errors.mobile = "Mobile number must be unique";
    }
  }

  return errors;
}


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