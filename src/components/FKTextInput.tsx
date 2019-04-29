import { FieldProps } from 'formik';
import React from 'react';

interface AdditionalProps {
  disabled?: boolean;
  required?: boolean;
}

interface FormValues {
  [key: string]: string;
}

const FKTextInput = ({
  disabled = false,
  field,
  form: { errors, touched },
  required = false,
}: FieldProps<FormValues> & AdditionalProps) => (
  <div>
    <b>
      {field.name}
      {required && <span>*</span>}:
    </b>
    <input disabled={disabled} type="text" {...field} />
    {errors[field.name] && touched[field.name] && <div>{errors[field.name]}</div>}
  </div>
);

export default FKTextInput;
