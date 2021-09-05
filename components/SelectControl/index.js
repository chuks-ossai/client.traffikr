const { components } = require("react-select");

export const SelectControl = (props) => (
  <>
    <components.Control
      className={props?.selectProps?.controlClassName}
      {...props}
    >
      {props.children}
    </components.Control>
    <div className="invalid-feedback">{props?.selectProps.controlErrorMsg}</div>
  </>
);
