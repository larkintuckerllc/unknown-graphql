import React, { PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { DeleteEntityData, DeleteEntityVariables } from './index';
interface Props {
  deleteEntity: MutationFn<DeleteEntityData, DeleteEntityVariables>;
  loading: boolean;
  nodeId: string;
  title: string;
}

export default class EntitiesEntity extends PureComponent<Props> {
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
    const { deleteEntity, nodeId } = this.props;
    deleteEntity({
      variables: {
        nodeId,
      },
    });
  };
}
