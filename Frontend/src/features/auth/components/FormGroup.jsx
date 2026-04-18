const FormGroup = ({ lable, placeholder, value, onChange }) => {
  return (
    <div className="form-group">
      <lable htmlFor={lable}>{lable} </lable>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        id={lable}
        name={lable}
        required
      />
    </div>
  );
};

export default FormGroup;
