import { FieldProps } from 'formik';
import React, { FC } from 'react';

interface AdditionalProps {
  disabled?: boolean;
  required?: boolean;
}

interface FormValues {
  [key: string]: string;
}

const FKTextInput: FC<FieldProps<FormValues> & AdditionalProps> = ({
  disabled = false,
  field,
  form: { errors, touched },
  required = false,
}) => (
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
