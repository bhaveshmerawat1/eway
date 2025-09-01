import clsx from "clsx";

interface DropdownWrapperProps {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
  onMouseLeave?: () => void;
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  isOpen = false,
  className="",
  children,
  onMouseLeave
}) => {
  const baseStyles = "absolute top-full shadow-lg py-4 transition duration-100 ease-in bg-gray-c border-t-1 border-gray-300 z-3";
  if (!isOpen) return null;
  return (
    <div className={clsx(baseStyles, className)} onMouseLeave={onMouseLeave}>
      <div className="dropdown-overlay" />
      <div className="dropdown-content">
        {children}
      </div>
    </div>
  );
};

export default DropdownWrapper;