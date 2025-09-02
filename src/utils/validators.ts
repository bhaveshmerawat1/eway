import { NewEmployee } from "@/utils/EmployeeTypes";

export function validateEmployee(e: Partial<NewEmployee>) {
  const errors: Partial<Record<keyof NewEmployee, string>> = {};

  if (!e.firstName?.trim()) errors.firstName = "First name is required";
  if (!e.lastName?.trim()) errors.lastName = "Last name is required";
  const ageNum = Number(e.age);
  if (!Number.isFinite(ageNum) || ageNum < 16 || ageNum > 80)
    errors.age = "Age must be between 16 and 80";
  if (!e.joiningDate) errors.joiningDate = "Joining date is required";
  if (!e.address?.trim()) errors.address = "Address is required";
  if (!e.mobile?.trim()) errors.mobile = "Mobile is required";
  // very light phone check
  if (e.mobile && !/^\D*(\d\D*){10}$/.test(e.mobile)) {
    errors.mobile = "Invalid phone number. Must contain exactly 10 digits.";
  }


  return errors;
}
