const InputField = ({ id, label, type = 'text', value, onChange, placeholder, error, required = false, disabled = false, min, children }) => (
  <div className="input-group">
    {label && <label htmlFor={id} className="input-label">{label} {required && <span className="required-star">*</span>}</label>}
    {children ? children : (
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        disabled={disabled} min={min} required={required}
        className={`input-field ${error ? 'input-error' : ''}`} />
    )}
    {error && <span className="input-error-msg">{error}</span>}
  </div>
);

export default InputField;
