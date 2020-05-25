import React from 'react';
import { connect } from 'react-redux'

import actions from './state/actions';

// https://reactjs.org/docs/react-component.html
class App extends React.Component {
	componentDidMount() {
		this.props.updateMessage('Hello World')
	}
	componentDidUpdate() {}
	componentWillUnmount() {}

	render() {
		const { message, updateMessage } = this.props || {} ;
		return <div>
			<h1>{message}</h1>
			<button onClick={updateMessage.bind(null, 'Bye World')}>Update</button>
		</div>;
	}
}

// Map Redux state to component props
const mapStateToProps = (state) => ({
    message: state.message
})

// Map Redux actions to component props
const mapDispatchToProps = (dispatch) => ({
    updateMessage: (message) => dispatch({ type: actions.UPDATE_MESSAGE, payload: message })
})

// Connected Component
export default connect(mapStateToProps, mapDispatchToProps)(App)