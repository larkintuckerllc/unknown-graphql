import { gql } from 'apollo-boost';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
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

interface Todo {
  id: number;
  title: string;
}

interface Data {
  allTodos: {
    nodes: Todo[];
  };
}

const Todos = () => (
  <Query<Data> query={ALL_TODOS_QUERY}>
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>;
      }
      if (error || data === undefined) {
        return <p>Error :(</p>;
      }
      const {
        allTodos: { nodes: todos },
      } = data;
      return (
        <Fragment>
          <TodosCreate />
          {todos.map(({ id, title }) => (
            <TodosTodo key={id} id={id} title={title} />
          ))}
        </Fragment>
      );
    }}
  </Query>
);

export default Todos;
