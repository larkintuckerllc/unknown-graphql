import { gql } from 'apollo-boost';
import { DataProxy } from 'apollo-cache';
import React, { Fragment } from 'react';
import { FetchResult, Mutation, Query } from 'react-apollo';
import TodosCreate from './TodosCreate';
import TodosTodo from './TodosTodo';

const ALL_TODOS_QUERY = gql`
  {
    allTodos {
      nodes {
        id
        nodeId
        title
      }
    }
  }
`;

const CREATE_TODO_MUTATION = gql`
  mutation createTodo($title: String!) {
    createTodo(input: { todo: { title: $title } }) {
      todo {
        id
        nodeId
        title
      }
    }
  }
`;

const DELETE_TODO_MUTATION = gql`
  mutation deleteTodo($nodeId: ID!) {
    deleteTodo(input: { nodeId: $nodeId }) {
      deletedTodoId
    }
  }
`;

interface Todo {
  id: number;
  nodeId: string;
  title: string;
}

interface AllTodosData {
  allTodos: {
    nodes: Todo[];
  };
}

export interface CreateTodoData {
  createTodo: {
    todo: {
      id: number;
      nodeId: string;
      title: string;
    };
  };
}

export interface CreateTodoVariables {
  title: string;
}

export interface DeleteTodoData {
  deleteTodo: {
    deletedTodoId: string;
  };
}

export interface DeleteTodoVariables {
  nodeId: string;
}

const handleCreateTodoUpdate = (cache: DataProxy, { data }: FetchResult<CreateTodoData>) => {
  if (data === undefined) {
    return;
  }
  const {
    createTodo: { todo },
  } = data;
  const cacheData = cache.readQuery<AllTodosData>({ query: ALL_TODOS_QUERY });
  if (cacheData === null) {
    return;
  }
  const { allTodos } = cacheData;
  const { nodes: todos } = allTodos;
  const newAllTodos = { ...allTodos };
  newAllTodos.nodes = [...todos, todo];
  cache.writeQuery({
    data: { allTodos: newAllTodos },
    query: ALL_TODOS_QUERY,
  });
};

const handleDeleteTodoUpdate = (cache: DataProxy, { data }: FetchResult<DeleteTodoData>) => {
  if (data === undefined) {
    return;
  }
  const {
    deleteTodo: { deletedTodoId },
  } = data;
  const cacheData = cache.readQuery<AllTodosData>({ query: ALL_TODOS_QUERY });
  if (cacheData === null) {
    return;
  }
  const { allTodos } = cacheData;
  const { nodes: todos } = allTodos;
  const filteredTodos = todos.filter(todo => todo.nodeId !== deletedTodoId);
  const newAllTodos = { ...allTodos };
  newAllTodos.nodes = filteredTodos;
  cache.writeQuery({
    data: { allTodos: newAllTodos },
    query: ALL_TODOS_QUERY,
  });
};

const Todos = () => (
  <Mutation<DeleteTodoData, DeleteTodoVariables>
    mutation={DELETE_TODO_MUTATION}
    update={handleDeleteTodoUpdate}
  >
    {(deleteTodo, { loading: loadingD, error: errorD }) => {
      return (
        <Mutation<CreateTodoData, CreateTodoVariables>
          mutation={CREATE_TODO_MUTATION}
          update={handleCreateTodoUpdate}
        >
          {(createTodo, { loading: loadingC, error: errorC }) => {
            return (
              <Query<AllTodosData> query={ALL_TODOS_QUERY}>
                {({ loading: loadingA, error: errorA, data: dataA }) => {
                  if (loadingA) {
                    return <p>Loading...</p>;
                  }
                  if (errorA || dataA === undefined) {
                    return <p>Error :(</p>;
                  }
                  const {
                    allTodos: { nodes: todos },
                  } = dataA;
                  return (
                    <Fragment>
                      <TodosCreate
                        createTodo={createTodo}
                        error={errorC !== undefined}
                        loading={loadingC}
                      />
                      {errorD !== undefined && <div>Error Deleting</div>}
                      {todos.map(({ nodeId, title }) => (
                        <TodosTodo
                          deleteTodo={deleteTodo}
                          key={nodeId}
                          nodeId={nodeId}
                          loading={loadingD}
                          title={title}
                        />
                      ))}
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

export default Todos;
