import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import './App.css';
import Entities from './components/Entities';
import Todos from './components/Todos';
import logo from './logo.svg';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Entities plural="Todos" singular="Todo" />
          <Entities plural="Todos" singular="Todo" />
          <Todos />
          <Todos />
        </header>
      </div>
    </ApolloProvider>
  );
};

export default App;
