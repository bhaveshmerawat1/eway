"use client";
import React, { useState } from "react";
import { Employee, NewEmployee } from "@/utils/EmployeeTypes";
import { validateEmployee } from "@/utils/validators";
import "@/assets/styles/common.css";
import Button from "./Button/Button";
import { useEmployees } from "@/context/EmployeeContext";

const empty: NewEmployee = {
  firstName: "",
  lastName: "",
  age: 18,
  joiningDate: "",
  address: "",
  mobile: "",
};

const Field: React.FC<{
  label: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}> = ({ label, error, children, htmlFor }) => (
  <div className="field">
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {error && <div className="error">{error}</div>}
  </div>
);

const EmployeeForm: React.FC = () => {
  const { allEmployees,modalAction } = useEmployees();

  const mode = modalAction.editing ? "edit" : "create";
  const [formInputVal, setFormInputVal] = useState<NewEmployee | Employee>({
    ...empty,
    ...modalAction.editing,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof NewEmployee, string>>
  >({});

  const update = <K extends keyof (NewEmployee | Employee)>(
    key: K,
    val: any
  ) => setFormInputVal((prev) => ({ ...prev, [key]: val }));

  const submit = (item: React.FormEvent) => {
    item.preventDefault();
    const validation = validateEmployee(
      formInputVal as NewEmployee,
      allEmployees.employees,
      mode === "edit"
    );
    setErrors(validation);
    if (Object.keys(validation).length) return;

    if (mode === "edit") {
      allEmployees.updateEmployeeDetails(formInputVal as Employee);
    } else {
      allEmployees.createNewEmployee(formInputVal as NewEmployee);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="grid2">
        <Field label="First Name" htmlFor="firstName" error={errors.firstName}>
          <input
            name="firstName"
            id="firstName"
            value={formInputVal.firstName}
            onChange={(val) => update("firstName", val.target.value)}
            maxLength={20}
          />
        </Field>
        <Field label="Last Name" htmlFor="lastName" error={errors.lastName}>
          <input
            value={formInputVal.lastName}
            id="lastName"
            name="lastName"
            onChange={(val) => update("lastName", val.target.value)}
            maxLength={20}
          />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Age" htmlFor="age" error={errors.age}>
          <input
            type="number"
            id="age"
            name="age"
            min={16}
            max={80}
            value={formInputVal.age}
            onChange={(val) => update("age", Number(val.target.value))}
          />
        </Field>
        <Field
          label="Joining Date"
          htmlFor="joiningDate"
          error={errors.joiningDate}
        >
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formInputVal.joiningDate}
            onChange={(val) => update("joiningDate", val.target.value)}
          />
        </Field>
      </div>

      <Field label="Mobile" htmlFor="mobileNumber" error={errors.mobile}>
        <input
          placeholder="0000 0000 00"
          value={formInputVal.mobile}
          id="mobileNumber"
          name="mobileNumber"
          onChange={(val) => update("mobile", val.target.value)}
          type="number"
        />
      </Field>

      <Field label="Address" htmlFor="address" error={errors.address}>
        <textarea
          value={formInputVal.address}
          id="address"
          name="address"
          onChange={(val) => update("address", val.target.value)}
          maxLength={200}
        />
      </Field>

      <div className="actions">
        <Button
          children={mode === "edit" ? "Update" : "Add Employee"}
          type="submit"
          variant="primary"
          arialabel={mode === "edit" ? "updateEmployee" : "addEmployee"}
        />
      </div>
    </form>
  );
};

export default EmployeeForm;
