import React from 'react';

// https://reactjs.org/docs/react-component.html
class App extends React.Component {
	constructor() {
		super();
		this.state = {};
	}

	componentDidMount() {
		this.setState({ message: 'Hello World' })
	}
	componentDidUpdate() {}
	componentWillUnmount() {}

	render() {
		const { message } = this.state;
		return <h1>{message}</h1>;
	}
}

export default App;