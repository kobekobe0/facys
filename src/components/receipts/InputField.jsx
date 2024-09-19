import React from "react"; // We only need React here

const InputField = React.memo(({ label, value, onChange, width, editable }) => {
  // Remove console.log for production (optional)
  console.log("InputField rendered", label, value, width);

  return (
    <input
      className={`${width} border px-2 py-1 text-lg ${label == 'Amount' ? value <= 0 ? 'font-normal text-gray-600' : 'font-medium' : ''}`}
      type={label === 'Amount' ? 'number' : 'text'}
      placeholder={label}
      onChange={onChange}
      value={value || ''} // Set default value if undefined
      readOnly={editable !== undefined ? !editable : false}
    />
  );
}, (prevProps, nextProps) => prevProps.value === nextProps.value); // Compare values

export default InputField;