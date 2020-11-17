//Files
import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//Components
import Home from './Components/Site/Home/Home';
import Beta from './Components/Site/Beta/Beta';
import About from './Components/Site/About/About';
import Contact from './Components/Site/Contact/Contact';
import Login from './Components/Site/Login/Login';
import Main from './Components/Main/Main';
//Styles
import styles from './App.module.css';
//Assets


class App extends Component {

  render() {
    
    const url ='https://metamoderation.com'

    return ( 
      <div className={styles.app}>
        <Router>
          <Route path='/' exact component={()=> window.location = 'https://api.metamoderation.com/auth/userCheck'} url={url}/>
          <Route path='/home' exact component={Home} url={url}/>
          <Route path='/beta' exact component={Beta} url={url}/>
          <Route path='/about' exact component={About} url={url}/>
          <Route path='/contact' exact component={Contact} url={url}/>
          <Route path='/login' exact component={Login} url={url}/>
          <Route path='/dashboard' exact component={Main}/>
        </Router>
      </div>
    );
  }
}
  
export default App;