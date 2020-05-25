import { createStore } from 'redux';
import reducer from './root-reducer';

export default function createAppStore(
  initialState
) {
  return createStore(
    reducer,
    initialState
  );
}