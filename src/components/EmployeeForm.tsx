"use client";
import React, { useState } from "react";
import { Employee, NewEmployee } from "@/utils/EmployeeTypes";
import { validateEmployee } from "@/utils/validators";
import "@/assets/styles/common.css"
import Button from "./Button/Button";
import { useEmployees } from "@/context/EmployeeContext";

type Props = {
  initial?: Partial<Employee>;  
  onSubmit: (data: NewEmployee | Employee) => void;
  mode?: "create" | "edit";
};

const empty: NewEmployee = {
  firstName: "",
  lastName: "",
  age: 18,
  joiningDate: "",
  address: "",
  mobile: "",
};

const Field: React.FC<{ label: string; error?: string; htmlFor?: string; children: React.ReactNode }> = ({ label, error, children, htmlFor }) => (
  <div className="field">
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {error && <div className="error">{error}</div>}
  </div>
);

const EmployeeForm: React.FC<Props> = ({ initial, onSubmit, mode = "create" }) => {
  const { employees } = useEmployees(); // get existing employees
  const [form, setForm] = useState<NewEmployee | Employee>({ ...empty, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof NewEmployee, string>>>({});

  const update = <K extends keyof (NewEmployee | Employee)>(key: K, val: any) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateEmployee(
      form as NewEmployee,
      employees,
      mode === "edit"
    ); 
    setErrors(v);
    if (Object.keys(v).length) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={submit}>
      <div className="grid2">
        <Field label="First Name" htmlFor="firstName" error={errors.firstName}>
          <input name="firstName" id="firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
            maxLength={20} />
        </Field>
        <Field label="Last Name" htmlFor="lastName" error={errors.lastName}>
          <input value={form.lastName} id="lastName" name="lastName" onChange={(e) => update("lastName", e.target.value)}
            maxLength={20} />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Age" htmlFor="age" error={errors.age}>
          <input type="number"
            id={"age"}
            name="age"
            min={16}
            max={80}
            maxLength={3}
            value={form.age}
            onChange={(e) => update("age", Number(e.target.value))}
          />
        </Field>
        <Field label="Joining Date" htmlFor="joiningDate" error={errors.joiningDate}>
          <input type="date" id="joiningDate" name="joiningDate" value={form.joiningDate} onChange={(e) => update("joiningDate", e.target.value)} />
        </Field>
      </div>

      <Field label="Mobile" htmlFor="mobileNumber" error={errors.mobile}>
        <input
          placeholder="0000 0000 00"
          value={form.mobile}
          id="mobileNumber"
          name="mobileNumber"
          onChange={(e) => update("mobile", e.target.value)}
          type="number"
          maxLength={10} />
      </Field>

      <Field label="Address" htmlFor="address" error={errors.address}>
        <textarea value={form.address} id="address" name="address" onChange={(e) => update("address", e.target.value)} maxLength={200} />
      </Field>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <Button
          children={mode === "edit" ? "Update" : "Add Employee"}
          type="submit"
          variant="primary"
          arialabel={"addemployee"}
        />
      </div>
    </form>
  );
};

export default EmployeeForm;
