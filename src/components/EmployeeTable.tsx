"use client";
import React from "react";
import { Employee } from "@/utils/EmployeeTypes";
import Button from "./Button/Button";
import { useEmployees } from "@/context/EmployeeContext";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const TableHeaderCell: React.FC<{ field?: keyof Employee; children: React.ReactNode }> = ({
  field,
  children,
}) => {
  const { shorting } = useEmployees();

  const isActive = shorting.sort.field === field;

  return (
    <th
      className="th"
      onClick={field ? () => shorting.setSort(field) : undefined}
      style={{ cursor: field ? "pointer" : "default", whiteSpace: "nowrap" }}
    >
      <span className="flex items-center gap-1">
        {children}
        {field && (
          <span className="inline-flex flex-col leading-none textSize">
            {isActive ? (
              shorting.sort.order === "asc" ? (
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

const EmployeeTable: React.FC = () => {
  const { pageinfo,modalAction} = useEmployees();

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <TableHeaderCell >Sr. No.</TableHeaderCell>
            <TableHeaderCell field="firstName">Employee Name </TableHeaderCell>
            <TableHeaderCell field="age">Age</TableHeaderCell>
            <TableHeaderCell field="joiningDate">Joining Date</TableHeaderCell>
            <TableHeaderCell field="address">Address</TableHeaderCell>
            <TableHeaderCell field="mobile">Mobile Number</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {pageinfo.paginatedEmployees?.length === 0 ? (
            <tr><td colSpan={7} className="empty">No employees found</td></tr>
          ) : (
            pageinfo.paginatedEmployees?.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1 + (pageinfo.currentPage - 1) * 5}</td>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.age}</td>
                <td>{new Date(item.joiningDate).toLocaleDateString()}</td>
                <td>{item.address}</td>
                <td>{item.mobile}</td>
                <td>
                  <div className="action-group">
                    <Button
                      children="Edit"
                      arialabel="editBtn"
                      type="button"
                      onClick={() => modalAction.setEditing(item)}
                      variant="secondary"
                      className="actionEditBtn"
                    />
                    <Button
                      children="Delete"
                      type="button"
                      arialabel="deleteBtn"
                      onClick={() => modalAction.askDelete(item)}
                      variant="danger"
                    />
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
          disabled={pageinfo.currentPage === 1}
          onClick={() => pageinfo.setCurrentPage((page) => page - 1)}
          children={"<"}
          className="mr-3"
          variant="secondary"
          type="button"
          arialabel="prevBtn"
        />

        <span>Page {pageinfo.currentPage} of {pageinfo.totalPages}</span>
        <Button
          children={">"}
          type="button"
          className="ml-3"
          variant="secondary"
          disabled={pageinfo.currentPage === pageinfo.totalPages}
          onClick={() => pageinfo.setCurrentPage((page) => page + 1)}
          arialabel="nextBtn"
        />
      </div>
    </div>
  );
};

export default EmployeeTable;

