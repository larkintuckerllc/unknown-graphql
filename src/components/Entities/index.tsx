import { gql } from 'apollo-boost';
import { DataProxy } from 'apollo-cache';
import React from 'react';
import { FetchResult, Query } from 'react-apollo';
import EntitiesWithFields from './EntitiesWithFields';

interface Props {
  plural: string;
  singular: string;
}

export interface Field {
  name: string;
  type: {
    kind: string;
    ofType: {
      name: string;
    };
  };
}

interface IntrospectionData {
  __type: {
    fields: Field[];
  };
}

interface Entity {
  [key: string]: any;
}

export interface AllEntitiesData {
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

export type CreateEntityUpdate = (cache: DataProxy, result: FetchResult<CreateEntityData>) => void;

export interface DeleteEntityData {
  [key: string]: {
    [key: string]: string;
  };
}

export interface DeleteEntityVariables {
  nodeId: string;
}

export type DeleteEntityUpdate = (cache: DataProxy, result: FetchResult<DeleteEntityData>) => void;

const fieldsReducer = (accumulator: string, currentValue: Field) =>
  accumulator + `${currentValue.name}\n`;

const Entities = ({ singular, plural }: Props) => {
  const singularLower = singular.toLocaleLowerCase();
  const INTROSPECTION_QUERY = gql`
    {
      __type(name: "${singular}") {
        fields {
          name
          type {
            kind
            ofType {
              name
            }
          }
        }
      }
    }
  `;
  return (
    <Query<IntrospectionData> query={INTROSPECTION_QUERY}>
      {({ loading: loadingI, error: errorI, data: dataI }) => {
        if (loadingI) {
          return <p>Loading...</p>;
        }
        if (errorI || dataI === undefined) {
          return <p>Error :(</p>;
        }
        const {
          __type: { fields: allFields },
        } = dataI;
        const nodes = allFields.reduce(fieldsReducer, '');
        const ALL_ENTITIES_QUERY = gql`
          {
            all${plural} {
              nodes {
                ${nodes}
              }
            }
          }
        `;
        const fields = allFields.filter(field => field.name !== 'nodeId' && field.name !== 'id');
        const createEntityParams = fields.reduce((acc, field) => {
          let entry = `$${field.name}: String`;
          entry = field.type.kind === 'NON_NULL' ? entry + '!, ' : entry + ', ';
          return acc + entry;
        }, '');
        const createEntityParamsValues = fields.reduce((acc, field) => {
          const entry = `${field.name}: $${field.name}, `;
          return acc + entry;
        }, '');
        const CREATE_ENTITY_MUTATION = gql`
          mutation createEntity(${createEntityParams}) {
            create${singular}(input: { ${singularLower}: { ${createEntityParamsValues} } }) {
              ${singularLower} {
                ${nodes}
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
        const handleCreateEntityUpdate: CreateEntityUpdate = (cache, { data }) => {
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
        const handleDeleteEntityUpdate: DeleteEntityUpdate = (cache, { data }) => {
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
          <EntitiesWithFields
            allEntitiesQuery={ALL_ENTITIES_QUERY}
            createEntityMutation={CREATE_ENTITY_MUTATION}
            deleteEntityMutation={DELETE_ENTITY_MUTATION}
            fields={fields}
            onCreateEntityUpdate={handleCreateEntityUpdate}
            onDeleteEntityUpdate={handleDeleteEntityUpdate}
            plural={plural}
          />
        );
      }}
    </Query>
  );
};

export default Entities;
