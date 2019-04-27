import { gql } from 'apollo-boost';
import React, { Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import TodosCreate from './TodosCreate';
import TodosTodo from './TodosTodo';

const ALL_TODOS_QUERY = gql`
  {
    allTodos {
      nodes {
        id
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
        title
      }
    }
  }
`;

interface Todo {
  id: number;
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
      title: string;
    };
  };
}

export interface CreateTodoVariables {
  title: string;
}

const Todos = () => (
  <Mutation<CreateTodoData, CreateTodoVariables> mutation={CREATE_TODO_MUTATION}>
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
                {todos.map(({ id, title }) => (
                  <TodosTodo key={id} id={id} title={title} />
                ))}
              </Fragment>
            );
          }}
        </Query>
      );
    }}
  </Mutation>
);

export default Todos;
