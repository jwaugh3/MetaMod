//Files
import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//Components
import Home from './Components/Site/Home/Home';
import Beta from './Components/Site/Beta/Beta';
import About from './Components/Site/About/About';
import Contact from './Components/Site/Contact/Contact';
import Login from './Components/Site/Login/Login';
import Policy from './Components/Site/Policy/Policy';
import Main from './Components/Main/Main';
//Styles
import styles from './App.module.scss';


class App extends Component {

  checkProduction = (location) => {

    var inProduction = ''
    var url = ''
    var apiEndpoint = ''

    if(location === 'http://localhost:3000'){
      inProduction = false

      url = 'http://localhost:3000'
      apiEndpoint = 'http://localhost:5000'
    } else {
      inProduction = true

      url ='https://metamoderation.com'
      apiEndpoint = 'https://api.metamoderation.com'
    }

    return [inProduction, url, apiEndpoint]
  }

  render() {

    let url = this.checkProduction(window.location.host)[1]
    var apiEndpoint = this.checkProduction(window.location.host)[2]

    return ( 
      <div className={styles.app}>
        <Router>
          <Route path='/' exact component={Home}  url={url}/>
          <Route path='/policy' exact component={Policy}  url={url}/>
          <Route path='/home' exact component={Home} url={url}/>
          <Route path='/beta' exact component={Beta} url={url}/>
          <Route path='/about' exact component={About} url={url}/>
          <Route path='/contact' exact component={Contact} url={url}/>
          <Route path='/login' exact component={Login} url={url} apiEndpoint={apiEndpoint}/>
          <Route path='/dashboard' exact component={Main}/>
        </Router>
      </div>
    );
  }
}
  
export default App;