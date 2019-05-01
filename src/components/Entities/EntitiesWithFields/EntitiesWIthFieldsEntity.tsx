import React, { PureComponent } from 'react';
import { MutationFn } from 'react-apollo';
import { DeleteEntityData, DeleteEntityVariables, Field } from '../index';

interface Props {
  deleteEntity: MutationFn<DeleteEntityData, DeleteEntityVariables>;
  entity: { [key: string]: any };
  fields: Field[];
  loading: boolean;
  nodeId: string;
}

export default class EntitiesWithFieldsEntity extends PureComponent<Props> {
  public render() {
    const { fields, loading, entity } = this.props;
    return (
      <div>
        {fields.map(field => {
          const name = field.name;
          return (
            <div key={name}>
              <b>{name}</b>: {entity[name]}
            </div>
          );
        })}
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
