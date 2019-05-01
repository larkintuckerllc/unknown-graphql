import { Formik, FormikActions, FormikProps } from 'formik';
import React, { PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { CreateEntityData, CreateEntityVariables, Field } from '../../index';
import EntititesWithFieldsCreateView from './EntitiesWithFieldsCreateView';

interface Props {
  createEntity: MutationFn<CreateEntityData, CreateEntityVariables>;
  fields: Field[];
}

export interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

export default class EntitiesWithFieldsCreate extends PureComponent<Props> {
  public render() {
    const { fields } = this.props;
    const initialValues = fields.reduce((accumulator: FormValues = {}, currentValue: Field) => {
      return { ...accumulator, [currentValue.name]: '' };
    }, {});
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
    const { fields } = this.props;
    return <EntititesWithFieldsCreateView {...props} fields={fields} />;
  };

  private validate = (values: FormValues) => {
    const { fields } = this.props;
    const errors: FormErrors = {};
    fields.forEach(field => {
      if (field.type.kind !== 'NON_NULL') {
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
