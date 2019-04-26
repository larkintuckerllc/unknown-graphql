import React, { PureComponent } from 'react';

interface Props {
  id: number;
  title: string;
}

export default class TodosTodo extends PureComponent<Props> {
  public render() {
    const { title } = this.props;
    return (
      <div>
        {title}
        <button onClick={this.handleClick}>Delete</button>
      </div>
    );
  }

  private handleClick = () => {
    // const { id } = this.props;
    // TODO
  };
}
