import Joi from 'joi-browser'

const validate = (data, schema,) => {
    const result = Joi.validate(data, schema, { abortEarly: false })
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details)
        errors[item.path[0]] = item.message;
    return errors
}

const validateProperty = ({ name, value }, schema) => {
    const obj = { [name]: value };
    const newSchema = { [name]: schema[name]}
    const {error} = Joi.validate(obj, newSchema)
    return error ? error.details[0].message : null;
}

const handleSubmit= ({ setErrors, data, schema }, doSubmit, e) => {
    e.preventDefault();
    const newErrors = validate(data, schema)
    setErrors(newErrors || {})
    if (newErrors) return

    doSubmit();
}

const handleChange = (formProps, { currentTarget: input }) => {
    const { data, setData, errors, setErrors, schema } = formProps
    const errorMessage = validateProperty(input, schema);
    let newErrors = {...errors};
    if (errorMessage) {newErrors[input.name] = errorMessage;
    }
    else delete newErrors[input.name]

    const newData = {...data}
    newData[input.name] = input.value
    setData(newData)
    setErrors(newErrors)
}

const renderInput  = (name, label, formProps) => {
    const { data, errors } = formProps
    return(
        <div className="form-group">
            <label className="mt-3" htmlFor={name}><b>{label}</b></label>
            <input value={data[name]} onChange={(e) => handleChange(formProps, e)} name={name} id={name} type="text" className="form-control" />
            {errors[name] && <div className="alert alert-danger py-1">{errors[name]}</div>}
        </div>
    )
};

const renderButton = (label, { data, schema }) =>{
    return (
        <button disabled={validate(data, schema)} className="btn btn-primary mt-3">
            {label}
        </button>
    );
}

const Form = {
    validate,
    validateProperty,
    handleSubmit,
    renderInput,
    renderButton,
}

export default Form