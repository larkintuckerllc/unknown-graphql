import React, { PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { DeleteTodoData, DeleteTodoVariables } from './index';
interface Props {
  deleteTodo: MutationFn<DeleteTodoData, DeleteTodoVariables>;
  loading: boolean;
  nodeId: string;
  title: string;
}

export default class TodosTodo extends PureComponent<Props> {
  public render() {
    const { loading, title } = this.props;
    return (
      <div>
        {title}
        <button disabled={loading} onClick={this.handleClick}>
          Delete
        </button>
      </div>
    );
  }

  private handleClick = () => {
    const { deleteTodo, nodeId } = this.props;
    deleteTodo({
      variables: {
        nodeId,
      },
    });
  };
}
