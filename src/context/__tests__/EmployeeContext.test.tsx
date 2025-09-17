// import { renderHook, act } from "@testing-library/react";
// import { EmployeeProvider, useEmployees } from "@/context/EmployeeContext";
// import { api } from "../../../test/__mocks__/axios";

// jest.mock("@/lib/axios");

// const wrapper = ({ children }: any) => <EmployeeProvider>{children}</EmployeeProvider>;

// describe("EmployeeContext", () => {
//   beforeEach(() => jest.clearAllMocks());

//   it("loads employees from API", async () => {
//     (api.get as jest.Mock).mockResolvedValueOnce({ data: { employees: [{ id: "1", firstName: "John", lastName: "Doe", address: "NY", mobile: "123", age: 30 }] } });
//     const { result } = renderHook(() => useEmployees(), { wrapper });

//     await act(async () => {
//       await result.current.allEmployees.reloadEmployees();
//     });

//     expect(result.current.allEmployees.employees.length).toBe(1);
//     expect(result.current.allEmployees.employees[0].firstName).toBe("John");
//   });

//   it("creates new employee", async () => {
//     (api.post as jest.Mock).mockResolvedValueOnce({});
//     (api.get as jest.Mock).mockResolvedValueOnce({ data: { employees: [] } });
//     const { result } = renderHook(() => useEmployees(), { wrapper });

//     await act(async () => {
//       await result.current.allEmployees.createNewEmployee({
//         firstName: "Jane",
//         lastName: "Smith",
//         address: "LA",
//         mobile: "999",
//         age: 25,
//         joinedAt:"12/02/1996"
//       });
//     });

//     expect(api.post).toHaveBeenCalledWith("/employees", expect.any(Object));
//   });

//   it("updates employee", async () => {
//     (api.put as jest.Mock).mockResolvedValueOnce({});
//     (api.get as jest.Mock).mockResolvedValueOnce({ data: { employees: [] } });

//     const { result } = renderHook(() => useEmployees(), { wrapper });

//     await act(async () => {
//       await result.current.allEmployees.updateEmployeeDetails({
//         id: "1",
//         firstName: "Jane",
//         lastName: "Smith",
//         address: "LA",
//         mobile: "999",
//         age: 25,
//         joinedAt: "12/02/1996"
//       });
//     });

//     expect(api.put).toHaveBeenCalledWith("/employees/1", expect.any(Object));
//   });

//   it("deletes employee", async () => {
//     (api.delete as jest.Mock).mockResolvedValueOnce({});
//     (api.get as jest.Mock).mockResolvedValueOnce({ data: { employees: [] } });

//     const { result } = renderHook(() => useEmployees(), { wrapper });

//     act(() => {
//       result.current.modalAction.askToEmpDelete({
//         id: "1",
//         firstName: "Delete",
//         lastName: "Me",
//         address: "Delhi",
//         mobile: "12345",
//         age: 28,
//         joinedAt: "12/02/1996"
//       });
//     });

//     await act(async () => {
//       await result.current.modalAction.confirmDelete();
//     });

//     expect(api.delete).toHaveBeenCalledWith("/employees/1");
//   });
// });
