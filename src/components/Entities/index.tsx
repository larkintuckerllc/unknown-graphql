import { gql } from 'apollo-boost';
import { DataProxy } from 'apollo-cache';
import React, { Fragment } from 'react';
import { FetchResult, Mutation, Query } from 'react-apollo';
// import EntitiesCreate from './EntitiesCreate';
import EntitiesEntity from './EntitiesEntity';

interface Entity {
  [key: string]: any;
}

interface AllEntitiesData {
  [key: string]: {
    nodes: Entity[];
  };
}

export interface CreateEntityData {
  [key: string]: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

export interface CreateEntityVariables {
  [key: string]: any;
}

export interface DeleteEntityData {
  [key: string]: {
    [key: string]: string;
  };
}

export interface DeleteEntityVariables {
  nodeId: string;
}

interface Props {
  plural: string;
  singular: string;
}

const Entities = ({ singular, plural }: Props) => {
  const singularLower = singular.toLocaleLowerCase();

  // TODO: NEED SHAPE
  const ALL_ENTITIES_QUERY = gql`
    {
      all${plural} {
        nodes {
          id
          nodeId
          title
        }
      }
    }
  `;

  // TODO: NEED SHAPE
  const CREATE_ENTITY_MUTATION = gql`
    mutation createEntity($title: String!) {
      create${singular}(input: { ${singularLower}: { title: $title } }) {
        ${singularLower} {
          id
          nodeId
          title
        }
      }
    }
  `;

  const DELETE_ENTITY_MUTATION = gql`
    mutation deleteEntity($nodeId: ID!) {
      delete${singular}(input: { nodeId: $nodeId }) {
        deleted${singular}Id
      }
    }
  `;

  const handleCreateEntityUpdate = (cache: DataProxy, { data }: FetchResult<CreateEntityData>) => {
    if (data === undefined) {
      return;
    }
    const entity = data[`create${singular}`][singularLower];
    const cacheData = cache.readQuery<AllEntitiesData>({ query: ALL_ENTITIES_QUERY });
    if (cacheData === null) {
      return;
    }
    const allEntities = cacheData[`all${plural}`];
    const { nodes: entities } = allEntities;
    const newAllEntities = { ...allEntities };
    newAllEntities.nodes = [...entities, entity];
    cache.writeQuery({
      data: { [`all${plural}`]: newAllEntities },
      query: ALL_ENTITIES_QUERY,
    });
  };

  const handleDeleteEntityUpdate = (cache: DataProxy, { data }: FetchResult<DeleteEntityData>) => {
    if (data === undefined) {
      return;
    }
    const deletedEntityId = data[`delete${singular}`][`deleted${singular}Id`];
    const cacheData = cache.readQuery<AllEntitiesData>({ query: ALL_ENTITIES_QUERY });
    if (cacheData === null) {
      return;
    }
    const allEntities = cacheData[`all${plural}`];
    const { nodes: entities } = allEntities;
    const filteredEntities = entities.filter(entity => entity.nodeId !== deletedEntityId);
    const newAllEntities = { ...allEntities };
    newAllEntities.nodes = filteredEntities;
    cache.writeQuery({
      data: { [`all${plural}`]: newAllEntities },
      query: ALL_ENTITIES_QUERY,
    });
  };

  return (
    <Mutation<DeleteEntityData, DeleteEntityVariables>
      mutation={DELETE_ENTITY_MUTATION}
      update={handleDeleteEntityUpdate}
    >
      {(deleteEntity, { loading: loadingD, error: errorD }) => {
        return (
          <Mutation<CreateEntityData, CreateEntityVariables>
            mutation={CREATE_ENTITY_MUTATION}
            update={handleCreateEntityUpdate}
          >
            {(createEntity, { loading: loadingC, error: errorC }) => {
              return (
                <Query<AllEntitiesData> query={ALL_ENTITIES_QUERY}>
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
                        {/*
                        <EntitiesCreate
                          createEntity={createEntity}
                          error={errorC !== undefined}
                          loading={loadingC}
                        />
                        */}
                        {errorD !== undefined && <div>Error Deleting</div>}
                        {entities.map(entity => {
                          const { nodeId } = entity;
                          return (
                            <EntitiesEntity
                              deleteEntity={deleteEntity}
                              entity={entity}
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
};

export default Entities;
