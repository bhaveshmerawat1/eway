"use client";
import React from "react";
import "@/assets/styles/common.css";
import Button from "./Button/Button";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number; // px
};

const Modal: React.FC<ModalProps> = ({ open, title, onClose, children, width = 720 }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ width }}>
        <div className="modal-header">
          {/* Modal title */}
          <h3 className="modal-title">{title}</h3>
          <Button 
          onClick={onClose} 
          variant="secondary" 
          children={"✕"} 
          arialabel="close" 
          className="modal-button"
           />
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
