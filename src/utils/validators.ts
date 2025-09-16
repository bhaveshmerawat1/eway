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

  if (!e.joiningDate) errors.joiningDate = "Joining date is required";
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

// Api validation
export function apiValidateEmployee(data: any, isUpdate = false) {
  const errors: string[] = [];

  if (!isUpdate && !data.firstName) {
    errors.push("First name is required");
  } else if (data.firstName && data.firstName.length < 2) {
    errors.push("First name must be at least 2 characters");
  }

  if (!isUpdate && !data.lastName) {
    errors.push("Last name is required");
  }

  if (typeof data.age !== "number" || data.age < 18 || data.age > 65) {
    errors.push("Age must be a number between 18 and 65");
  }

  if (!data.joiningDate || isNaN(Date.parse(data.joiningDate))) {
    errors.push("Joining date must be a valid date");
  }

  if (!data.address || data.address.length < 5) {
    errors.push("Address must be at least 5 characters");
  }

  if (!data.mobile || !/^\d{10}$/.test(data.mobile)) {
    errors.push("Mobile number must be exactly 10 digits");
  }

  return errors;
}
