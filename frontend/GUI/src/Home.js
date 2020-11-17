import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import io from 'socket.io-client';
import img from './pexels-photo-531880.jpeg';
// import app from './Auth/base';

import NavBar from './NavBar.js';
import DevicesPage from './screens/DevicesPage';
import DivisionsPage from './screens/DivisionsPage';
import ScenesPage from './screens/ScenesPage';
// import GraphicsPage from './screens/GraphicsPage';
import DevicesSettingsPage from './screens/DevicesSettingsPage';
import StatisticsPage from './screens/StatisticsPage';

const styles = {
  app: {
      backgroundImage: `url(${img})`,
      height: '100%',
      minHeight : '100vh'
  }
};

const ENDPOINT = "http://188.251.221.203:8000";
const socket = io(ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']})

function Home() {
    
  return (
    <div style={styles.app}>
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path='/' render={(props) => (<DevicesPage {...props} socket={socket}/>)} />
        <Route exact path='/divisions' render={(props) => (<DivisionsPage {...props} socket={socket}/>)} />
        <Route exact path='/scenes' render={(props) => (<ScenesPage {...props} socket={socket}/>)} />
        {/* <Route exact path='/graphics' render={(props) => (<GraphicsPage {...props} socket={socket}/>)}/> */}
        <Route exact path='/statistics' render={(props) => (<StatisticsPage {...props} socket={socket}/>)}/>
        <Route exact path='/devices_settings' render={(props) => (<DevicesSettingsPage {...props} socket={socket}/>)}/>
      </Switch>
    </BrowserRouter>
    </div>
  );
}

export default Home;


