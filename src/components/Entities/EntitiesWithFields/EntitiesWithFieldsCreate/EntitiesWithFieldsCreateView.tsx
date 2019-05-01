import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import FKFormInput from '../../../FKTextInput';
import { Field as MyField } from '../../index';
import { FormValues } from './index';

interface AdditionalProps {
  fields: MyField[];
}

const EntitiesCreateView = ({
  fields,
  isSubmitting,
  isValid,
  status = {},
}: FormikProps<FormValues> & AdditionalProps) => (
  <Form>
    {fields.map(field => {
      const {
        name,
        type: { kind },
      } = field;
      return (
        <Field
          disabled={isSubmitting}
          key={name}
          name={name}
          component={FKFormInput}
          required={kind === 'NON_NULL'}
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
