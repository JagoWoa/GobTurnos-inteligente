export function PreferenceSwitch({ label, active, onToggle, activeText, inactiveText, onLabel, offLabel }) {
  return (
    <div className="control-row">
      <div>
        <strong>{label}</strong>
        <span>{active ? activeText : inactiveText}</span>
      </div>
      <button type="button" className={`switch ${active ? "is-on" : ""}`} role="switch" aria-checked={active} onClick={onToggle}>
        <span aria-hidden="true" />
        {active ? onLabel : offLabel}
      </button>
    </div>
  );
}
