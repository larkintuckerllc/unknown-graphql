import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import FKFormInput from '../../FKTextInput';
import { FormValues } from './index';

const EntitiesCreateView = ({ isSubmitting, isValid, status = {} }: FormikProps<FormValues>) => (
  <Form>
    <Field disabled={isSubmitting} name="title" component={FKFormInput} required={true} />
    {status.failed && <div>Failed</div>}
    <button disabled={!isValid || isSubmitting} type="submit">
      Create
    </button>
  </Form>
);

export default EntitiesCreateView;
