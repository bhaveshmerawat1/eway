// src/lib/validate.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

interface EmployeeInput {
  firstName?: string;
  lastName?: string;
  age?: number | string;
  mobile?: string;
  address?: string;
  joinedAt?: string;
}

/**
 * Validate employee data for create/update.
 * @param data The employee input data
 * @param partial If true, fields are optional (for update)
 * @returns string | null - error message or null if valid
 */
export function validateEmployee(data: EmployeeInput, partial = false): string | null {
  // ✅ firstName
  if (!partial || data.firstName !== undefined) {
    if (!data.firstName || data.firstName.trim().length < 2) {
      return "First name must be at least 2 characters long";
    }
  }

  // lastNmae
  if (!partial || data.lastName !== undefined) {
    if (!data.lastName || data.lastName.trim().length < 2) {
      return "LAst name must be at least 2 characters long";
    }
  }

  // ✅ age
  if (!partial || data.age !== undefined) {
    if (data.age !== null && data.age !== undefined) {
      const ageNum = Number(data.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 70) {
        return "Age must be a number between 18 and 70";
      }
    }
  }

  // ✅ mobile
  if (!partial || data.mobile !== undefined) {
    if (data.mobile && !/^\d{10}$/.test(data.mobile)) {
      return "Mobile must be a valid 10-digit number";
    }
  }

  // ✅ joiningDate
  if (!partial || data.joinedAt !== undefined) {
    if (data.joinedAt && isNaN(Date.parse(data.joinedAt))) {
      return "Joining date must be a valid date";
    }
  }

  return null;
}
