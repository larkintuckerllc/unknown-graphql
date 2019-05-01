import React, { FC, Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import {
  AllEntitiesData,
  CreateEntityData,
  CreateEntityUpdate,
  CreateEntityVariables,
  DeleteEntityData,
  DeleteEntityUpdate,
  DeleteEntityVariables,
  Field,
} from '../index';
import EntitiesWithFieldsCreate from './EntitiesWithFieldsCreate';
import EntitiesWithFieldsEntity from './EntitiesWIthFieldsEntity';

interface Props {
  allEntitiesQuery: any;
  createEntityMutation: any;
  deleteEntityMutation: any;
  fields: Field[];
  onCreateEntityUpdate: CreateEntityUpdate;
  onDeleteEntityUpdate: DeleteEntityUpdate;
  plural: string;
}

const EntitiesWithFields: FC<Props> = ({
  allEntitiesQuery,
  createEntityMutation,
  deleteEntityMutation,
  fields,
  onCreateEntityUpdate,
  onDeleteEntityUpdate,
  plural,
}) => (
  <Mutation<DeleteEntityData, DeleteEntityVariables>
    mutation={deleteEntityMutation}
    update={onDeleteEntityUpdate}
  >
    {(deleteEntity, { loading: loadingD, error: errorD }) => {
      return (
        <Mutation<CreateEntityData, CreateEntityVariables>
          mutation={createEntityMutation}
          update={onCreateEntityUpdate}
        >
          {createEntity => {
            return (
              <Query<AllEntitiesData> query={allEntitiesQuery}>
                {({ loading: loadingA, error: errorA, data: dataA }) => {
                  if (loadingA) {
                    return <p>Loading...</p>;
                  }
                  if (errorA || dataA === undefined) {
                    return <p>Error :(</p>;
                  }
                  const {
                    [`all${plural}`]: { nodes: entities },
                  } = dataA;
                  return (
                    <Fragment>
                      <EntitiesWithFieldsCreate createEntity={createEntity} fields={fields} />
                      {errorD !== undefined && <div>Error Deleting</div>}
                      {entities.map(entity => {
                        const { nodeId } = entity;
                        return (
                          <EntitiesWithFieldsEntity
                            deleteEntity={deleteEntity}
                            entity={entity}
                            fields={fields}
                            key={nodeId}
                            nodeId={nodeId}
                            loading={loadingD}
                          />
                        );
                      })}
                    </Fragment>
                  );
                }}
              </Query>
            );
          }}
        </Mutation>
      );
    }}
  </Mutation>
);

export default EntitiesWithFields;
