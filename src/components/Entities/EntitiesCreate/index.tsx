import { Formik, FormikActions, FormikProps } from 'formik';
import React, { PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { CreateEntityData, CreateEntityVariables, FormField } from '../index';
import EntititesCreateView from './EntitiesCreateView';

interface Props {
  createEntity: MutationFn<CreateEntityData, CreateEntityVariables>;
  formFields: FormField[];
}

export interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

export default class EntitiesCreate extends PureComponent<Props> {
  public render() {
    const { formFields } = this.props;
    const initialValues = formFields.reduce(
      (accumulator: FormValues = {}, currentValue: FormField) => {
        return { ...accumulator, [currentValue.name]: '' };
      },
      {}
    );
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        render={this.renderForm}
        validate={this.validate}
      />
    );
  }

  private renderForm = (props: FormikProps<FormValues>) => {
    const { formFields } = this.props;
    return <EntititesCreateView {...props} formFields={formFields} />;
  };

  private validate = (values: FormValues) => {
    const { formFields } = this.props;
    const errors: FormErrors = {};
    formFields.forEach(field => {
      if (!field.required) {
        return;
      }
      const { name } = field;
      if (values[name] === undefined) {
        errors[name] = 'Required';
      } else if (values[name].trim() === '') {
        errors[name] = 'Must not be blank';
      }
    });
    return errors;
  };

  private handleSubmit = async (
    values: FormValues,
    { resetForm, setStatus, setSubmitting }: FormikActions<FormValues>
  ) => {
    const { createEntity } = this.props;
    try {
      await createEntity({
        variables: values,
      });
      resetForm();
      setStatus({ succeeded: true });
      setSubmitting(false);
    } catch (error) {
      setStatus({ failed: true });
      setSubmitting(false);
    }
  };
}
