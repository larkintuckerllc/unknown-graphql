import { Formik, FormikActions, FormikProps } from 'formik';
import React, { PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { CreateEntityData, CreateEntityVariables } from '../index';
import EntititesCreateView from './EntitiesCreateView';

interface Props {
  createEntity: MutationFn<CreateEntityData, CreateEntityVariables>;
}

export interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

const render = (props: FormikProps<FormValues>) => <EntititesCreateView {...props} />;

export default class EntitiesCreate extends PureComponent<Props> {
  public render() {
    return (
      <Formik
        initialValues={{ title: '' }}
        onSubmit={this.handleSubmit}
        render={render}
        validate={this.validate}
      />
    );
  }

  private validate = (values: FormValues) => {
    const errors: FormErrors = {};
    if (values.title === undefined) {
      errors.title = 'Required';
    } else if (values.title.trim() === '') {
      errors.title = 'Must not be blank';
    }
    return errors;
  };

  private handleSubmit = async (
    values: FormValues,
    { resetForm, setStatus, setSubmitting }: FormikActions<FormValues>
  ) => {
    const { createEntity } = this.props;
    try {
      await createEntity({
        variables: {
          title: values.title,
        },
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
