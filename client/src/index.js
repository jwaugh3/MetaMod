import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

//reducers
import applicationReducer from './store/reducers/application';
import modChatReducer from './store/reducers/modChat';
import twitchChatReducer from './store/reducers/twitchChat';

const rootReducer = combineReducers({
  applicationReducer,
  modChatReducer,
  twitchChatReducer
})

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
