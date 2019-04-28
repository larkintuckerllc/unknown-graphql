import React, { PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { DeleteEntityData, DeleteEntityVariables } from './index';

interface Props {
  deleteEntity: MutationFn<DeleteEntityData, DeleteEntityVariables>;
  entity: { [key: string]: any };
  loading: boolean;
  nodeId: string;
}

export default class EntitiesEntity extends PureComponent<Props> {
  public render() {
    const { loading, entity } = this.props;
    return (
      <div>
        <div>{entity.title}</div>
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
