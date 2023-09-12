import React, {Component} from 'react';
import Confetti from 'react-confetti';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      numberOfPieces: 200,
    };
    this.props = props;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        numberOfPieces: 0,
      });
    }, 7000);
    this.props.onSolve();
  }

  render() {
    if (this.state.done) return null;
    return (
      <Confetti
        numberOfPieces={this.state.numberOfPieces}
        onConfettiComplete={() => this.setState({done: true})}
      />
    );
  }
}
