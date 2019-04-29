import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import FKFormInput from '../../FKTextInput';
import { FormField } from '../index';
import { FormValues } from './index';

interface AdditionalProps {
  formFields: FormField[];
}

const EntitiesCreateView = ({
  formFields,
  isSubmitting,
  isValid,
  status = {},
}: FormikProps<FormValues> & AdditionalProps) => (
  <Form>
    {formFields.map(field => {
      const { name, required } = field;
      return (
        <Field
          disabled={isSubmitting}
          key={name}
          name={name}
          component={FKFormInput}
          required={required}
        />
      );
    })}
    {status.failed && <div>Failed</div>}
    <button disabled={!isValid || isSubmitting} type="submit">
      Create
    </button>
  </Form>
);

export default EntitiesCreateView;
