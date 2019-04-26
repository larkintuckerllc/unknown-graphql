import React, { ChangeEvent, FormEvent, PureComponent } from 'react';

export default class TodosCreate extends PureComponent {
  public state = {
    dirty: false,
    title: '',
    valid: false,
  };

  public render() {
    const { dirty, title, valid } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} value={title} />
        <button disabled={!valid} type="submit">
          Create
        </button>
        {dirty && !valid && <div>Required</div>}
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
    // TRY SUMITTING
    this.setState({
      dirty: false,
      title: '',
      valid: false,
    });
  };
}
