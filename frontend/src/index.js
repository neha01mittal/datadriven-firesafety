import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { App } from './App';
import { Map } from './components/Map';

import registerServiceWorker from './registerServiceWorker';
import { history, store } from './store';
import { Provider } from 'react-redux';
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";


ReactDOM.render(  
    <Provider store={store}>
        { /* ConnectedRouter will use the store from Provider automatically */ }
        <ConnectedRouter history={history}>
        <div>
            <Route exact path="/" component={App}/>
            <Route exact path="/map" component={Map}/>
        </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);


registerServiceWorker();
