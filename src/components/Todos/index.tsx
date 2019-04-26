import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

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
      return todos.map(({ id, title }) => <p key={id}>{title}</p>);
    }}
  </Query>
);

export default Todos;
