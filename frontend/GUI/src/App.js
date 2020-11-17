import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import SignUp from './Auth/NewSignUp';
import Login from './Auth/NewLogin';

import { AuthProvider } from './Auth/Auth'; 
import PrivateRoute from './Auth/PrivateRoute';

function App(){
  return(
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  )
}
export default App;
