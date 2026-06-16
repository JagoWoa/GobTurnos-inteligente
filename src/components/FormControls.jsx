export function Field({ id, label, icon, type = "text", helper, ...props }) {
  const { error, ...inputProps } = props;
  const helpId = helper ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className="input-wrap">
        {icon}
        <input id={id} name={id} type={type} aria-describedby={describedBy} {...inputProps} />
      </div>
      {helper && <small id={helpId} className="field-help">{helper}</small>}
      {error && <small id={errorId} className="field-error">{error}</small>}
    </label>
  );
}

export function SelectField({ id, label, options }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} name={id}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
