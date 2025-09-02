export type Employee = {
  id: string;                 // uuid
  firstName: string;
  lastName: string;
  age: number;
  joiningDate: string;        // ISO date string
  address: string;
  mobile: string;             // keep as string to preserve leading zeros
};

export type NewEmployee = Omit<Employee, "id">;
