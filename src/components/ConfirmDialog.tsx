"use client";
import React from "react";
import Modal from "./Modal";
import Button from "./Button/Button";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirm",
  message,
  onCancel,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <Modal open={open} onClose={onCancel} title={title} width={420}>
      <p style={{ marginBottom: 16 }}>{message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button 
          children={cancelText}
          onClick={onCancel}
          variant="secondary"
          arialabel={cancelText}
        />
        <Button 
        children={confirmText}
        onClick={onConfirm}
        arialabel={'confirmDelete'}
        variant="danger"
        />
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
