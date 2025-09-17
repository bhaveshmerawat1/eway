"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  MutableRefObject,
} from "react";
import { Employee, NewEmployee } from "@/utils/EmployeeTypes";
import useToggle from "@/hooks/useToggle";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext"; // 👈 import auth

interface EmployeeContextValue {
  allEmployees: {
    employees: Employee[];
    createNewEmployee: (data: NewEmployee) => Promise<void>;
    updateEmployeeDetails: (data: Employee) => Promise<void>;
    filtered: Employee[];
    reloadEmployees: () => Promise<void>;
  };
  search: {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
  };
  pageinfo: {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
    totalPages: number;
    paginatedEmployees: Employee[];
  };
  shorting: {
    sort: { field: keyof Employee; order: "asc" | "desc" };
    setSort: (field: keyof Employee) => void;
  };
  modalAction: {
    employeeFormModal: ReturnType<typeof useToggle>;
    editing: Employee | null;
    setEditing: (emp: Employee | null) => void;
    confirmEmployeeDeleteAction: ReturnType<typeof useToggle>;
    toDeleteRef: MutableRefObject<Employee | null>;
    askToEmpDelete: (emp: Employee) => void;
    confirmDelete: () => Promise<void>;
    isLoading: boolean
    // setIsLoading: (val: boolean) => void
  };
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<Employee | null>(null);
  const employeeFormModal = useToggle(false);
  const confirmEmployeeDeleteAction = useToggle(false);
  const toDeleteRef = useRef<Employee | null>(null);
  const [sort, setSortState] = useState<{ field: keyof Employee; order: "asc" | "desc" }>({
    field: "firstName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { isAuthenticated, onLoginSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Only load employees when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      reloadEmployees();
    } else {
      setEmployees([]);
    }
  }, [isAuthenticated]);

  // // Auto-reload right after login/signup
  // useEffect(() => {
  //   onLoginSuccess(() => {
  //     reloadEmployees();
  //   });
  // }, [onLoginSuccess]);

// Fatch/Reload employee list 
  async function reloadEmployees() {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
      setIsLoading(false)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setEmployees([]);
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.error("Failed to load employees", err.response?.data || err.message);
      }
    }
  }

  // Create new employees
  async function createNewEmployee(data: NewEmployee) {
    try {
      await api.post("/employees", data);
      await reloadEmployees();
      employeeFormModal.close();
    } catch (err: any) {
      console.error("Create failed", err.response?.data || err.message);
    }
  }

  // Update existing employees
  async function updateEmployeeDetails(data: Employee) {
    setIsLoading(true)
    try {
      await api.put(`/employees/${data.id}`, data);
      await reloadEmployees();
      setEditing(null);
    } catch (err: any) {
      setIsLoading(false)
      console.error("Update failed", err.response?.data || err.message);
    }
  }

  // Delete 
  function askToEmpDelete(emp: Employee) {
    toDeleteRef.current = emp;
    confirmEmployeeDeleteAction.open();
  }

  async function confirmDelete() {
    if (!toDeleteRef.current) return;
    setIsLoading(true)
    try {
      await api.delete(`/employees/${toDeleteRef.current.id}`);
      await reloadEmployees();
      confirmEmployeeDeleteAction.close();
      toDeleteRef.current = null;
    } catch (err: any) {
      setIsLoading(false)
      console.error("Delete failed", err.response?.data || err.message);
    }
  }

  // Filter
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(emp =>
      [emp.firstName, emp.lastName, emp.address, emp.mobile].some(value =>
        value.toLowerCase().includes(q)
      ) || String(emp.age).includes(q)
    );
  }, [employees, searchQuery]);

  // Sorting
  const setSort = (field: keyof Employee) => {
    setSortState(prev =>
      prev.field === field
        ? { ...prev, order: prev.order === "asc" ? "desc" : "asc" }
        : { field, order: "asc" }
    );
  };

  const sortedEmployees = useMemo(() => {
    if (!sort.field) return filtered;
    const { field, order } = sort;
    return [...filtered].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort]);

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <EmployeeContext.Provider
      value={{
        allEmployees: {
          employees,
          createNewEmployee,
          updateEmployeeDetails,
          filtered,
          reloadEmployees,
        },
        search: { searchQuery, setSearchQuery },
        pageinfo: { currentPage, setCurrentPage, itemsPerPage, totalPages, paginatedEmployees },
        shorting: { sort, setSort },
        modalAction: {
          employeeFormModal,
          editing,
          setEditing,
          confirmEmployeeDeleteAction,
          askToEmpDelete,
          confirmDelete,
          toDeleteRef,
          isLoading
        },
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployees must be used inside EmployeeProvider");
  return ctx;
}
