/* eslint-disable react/prop-types */

const CurrencyInput = ({ label, value, onChange, options }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyInput;
