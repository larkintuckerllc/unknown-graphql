import React, { ChangeEvent, FormEvent, PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { CreateEntityData, CreateEntityVariables } from './index';

interface Props {
  createEntity: MutationFn<CreateEntityData, CreateEntityVariables>;
  error: boolean;
  loading: boolean;
}

export default class EntitiesCreate extends PureComponent<Props> {
  public state = {
    dirty: false,
    title: '',
    valid: false,
  };

  public render() {
    const { error, loading } = this.props;
    const { dirty, title, valid } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input disabled={loading} onChange={this.handleChange} value={title} />
        <button disabled={!valid || loading} type="submit">
          Create
        </button>
        {dirty && !valid && <div>Required</div>}
        {error && <div>Error Creating</div>}
      </form>
    );
  }

  private handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const valid = title.trim() !== '';
    this.setState({ dirty: true, title, valid });
  };

  private handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { createEntity } = this.props;
    const { title } = this.state;
    createEntity({
      variables: {
        title,
      },
    });
    this.setState({
      dirty: false,
      title: '',
      valid: false,
    });
  };
}
