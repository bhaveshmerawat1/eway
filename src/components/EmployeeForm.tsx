"use client";
import React, { useState } from "react";
import { Employee, NewEmployee } from "@/utils/EmployeeTypes";
import { validateEmployee } from "@/utils/validators";
import "@/assets/styles/common.css"
import Button from "./Button/Button";

type Props = {
  initial?: Partial<Employee>;            // for editing
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

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div className="field">
    <label>{label}</label>
    {children}
    {error && <div className="error">{error}</div>}
  </div>
);

const EmployeeForm: React.FC<Props> = ({ initial, onSubmit, mode = "create" }) => {
  const [form, setForm] = useState<NewEmployee | Employee>({ ...empty, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof NewEmployee, string>>>({});

  const update = <K extends keyof (NewEmployee | Employee)>(key: K, val: any) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateEmployee(form as NewEmployee);
    setErrors(v);
    if (Object.keys(v).length) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={submit}>
      <div className="grid2">
        <Field label="First Name" error={errors.firstName}>
          <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
            maxLength={20} />
        </Field>
        <Field label="Last Name" error={errors.lastName}>
          <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
            maxLength={20} />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Age" error={errors.age}>
          <input type="number"
            min={16}
            max={80}
            maxLength={3}
            value={form.age}
            onChange={(e) => update("age", Number(e.target.value))}
          />
        </Field>
        <Field label="Joining Date" error={errors.joiningDate}>
          <input type="date" value={form.joiningDate} onChange={(e) => update("joiningDate", e.target.value)} />
        </Field>
      </div>

      <Field label="Mobile" error={errors.mobile}>
        <input
          placeholder="0000 0000 00"
          value={form.mobile}
          onChange={(e) => update("mobile", e.target.value)}
          type="number"
          maxLength={10} />
      </Field>

      <Field label="Address" error={errors.address}>
        <textarea value={form.address} onChange={(e) => update("address", e.target.value)} maxLength={200} />
      </Field>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <Button
          children={mode === "edit" ? "Update" : "Add Employee"}
          type="submit"
          variant="primary"
        />
      </div>
    </form>
  );
};

export default EmployeeForm;
