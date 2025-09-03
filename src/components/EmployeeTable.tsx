"use client";
import React from "react";
import { Employee } from "@/utils/EmployeeTypes";
import Button from "./Button/Button";
import { useEmployees } from "@/context/EmployeeContext";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

type Props = {
  data: Employee[];
  onEdit: (emp: Employee | null) => void;
  onDelete: (emp: Employee) => void;
  highlightId?: string | null;
};

const TableHeaderCell: React.FC<{ field?: keyof Employee; children: React.ReactNode }> = ({
  field,
  children,
}) => {
  const { setSort, sortField, sortOrder } = useEmployees();

  const isActive = sortField === field;

  return (
    <th
      className="th"
      onClick={field ? () => setSort(field) : undefined}
      style={{ cursor: field ? "pointer" : "default", whiteSpace: "nowrap" }}
    >
      <span className="flex items-center gap-1">
        {children}
        {field && (
          <span className="inline-flex flex-col leading-none textSize">
            {isActive ? (
              sortOrder === "asc" ? (
                <FaCaretUp className="arrowColor" />
              ) : (
                  <FaCaretDown className="arrowColor" />
              )
            ) : (
              // default neutral icon
              <FaCaretUp className="text-gray-400 opacity-50 " />
            )}
          </span>
        )}
      </span>
    </th>
  );
};


const EmployeeTable: React.FC<Props> = ({ onEdit, onDelete, highlightId }) => {
  const { paginatedEmployees, currentPage, totalPages, setCurrentPage } = useEmployees();

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <TableHeaderCell >#</TableHeaderCell>
            <TableHeaderCell field="firstName">Name </TableHeaderCell>
            <TableHeaderCell field="age">Age</TableHeaderCell>
            <TableHeaderCell field="joiningDate">Joining Date</TableHeaderCell>
            <TableHeaderCell field="address">Address</TableHeaderCell>
            <TableHeaderCell field="mobile">Mobile</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees?.length === 0 ? (
            <tr><td colSpan={7} className="empty">No employees found</td></tr>
          ) : (
            paginatedEmployees?.map((e, idx) => (
              <tr key={e.id} className={e.id === highlightId ? "row-highlight" : undefined}>
                <td>{idx + 1 + (currentPage - 1) * 5}</td>
                <td>{e.firstName} {e.lastName}</td>
                <td>{e.age}</td>
                <td>{new Date(e.joiningDate).toLocaleDateString()}</td>
                <td>{e.address}</td>
                <td>{e.mobile}</td>
                <td>
                  <div className="action-group">
                    <Button children="Edit" arialabel="editBtn" onClick={() => onEdit(e)} variant="secondary" className="actionEditBtn" />
                    <Button children="Delete" arialabel="deleteBtn" onClick={() => onDelete(e)} variant="danger" />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          children={"<"}
          className="mr-3"
          variant="secondary"
        />

        <span>Page {currentPage} of {totalPages}</span>
        <Button
          children={">"}
          type="button"
          className="ml-3"
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        />
      </div>
    </div>
  );
};

export default EmployeeTable;

