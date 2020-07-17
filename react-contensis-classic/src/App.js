import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

import './App.css';

import { Cookies } from 'react-cookie';
import { Client } from 'contensis-management-api';

// ideally the names of any access related cookies should be obfuscated to make their intention less visible
const ContensisRefreshTokenCookieName = 'ContensisRefreshToken';
const ContensisInstanceUrl = 'https://cms-example.cloud.contensis.com';
const ContensisProjectId = 'website';

async function ensureContensisManagementApiClient(managementApiClient) {
  // before  any management api call we need to ensure we have a valid client
  // the client instance should be specific to the current user and stored in a global app variable or in local storage

  // in this example we use a cookie to store the refresh token
  const cookies = new Cookies();

  // if the client is already present we need to ensure its bearer token and its refresh token have not expired
  if (managementApiClient !== null && managementApiClient.clientConfig.clientType === "contensis_classic_refresh_token") {
    if (!managementApiClient.isBearerTokenExpired()) {
      // all good we can use the client
      return managementApiClient;
    }

    if (!managementApiClient.isRefreshTokenExpired) {
      try {
        await managementApiClient.ensureBearerToken();
        // all good we can use the client
        return managementApiClient;
      } catch (error) {
        console.log("Error geting the bearer token for the stored client", error);
      }
    }

    // if the refresh token has expired or there was an error the client and the refresh token cookie need to be reset
    managementApiClient = null;
    cookies.remove(ContensisRefreshTokenCookieName);
  }

  // We need to create a new client    
  // - if we have a refresh token stored create a client based on it
  // - if there is no refresh token or it has errors redirect to a login page to create a client based on user name and password

  let contensisRefreshToken = cookies.get(ContensisRefreshTokenCookieName);
  if (!!contensisRefreshToken) {
    managementApiClient = Client.create({
      clientType: "contensis_classic_refresh_token",
      clientDetails: {
        refreshToken: contensisRefreshToken
      },
      projectId: ContensisProjectId,
      rootUrl: ContensisInstanceUrl
    });
    try {
      await managementApiClient.ensureBearerToken();
      // all good we can use the client
      console.log('created client from refresh token cookie');
      return managementApiClient;
    } catch (error) {
      console.log("Error geting the bearer token for the stored client", error);
      managementApiClient = null;
      cookies.remove(ContensisRefreshTokenCookieName);
    }
  }

  return null;
}

async function createContensisManagementApiClient(username, password) {
  const cookies = new Cookies();
  // if we don't have a refresh token or there was an error creating a client with the current refresh token 
  // we need to redirect to a login page and create a temporary client based on user name and password
  // and store the refresh token
  let transientClient = Client.create({
    clientType: "contensis_classic",
    clientDetails: {
      username,
      password
    },
    projectId: ContensisProjectId,
    rootUrl: ContensisInstanceUrl
  });
  console.log('created client from user name and password');

  // any error at this point should be treated like a login error
  await transientClient.ensureBearerToken();

  // we can now store a client based on a refresh token
  let managementApiClient = Client.create({
    clientType: "contensis_classic_refresh_token",
    clientDetails: {
      refreshToken: transientClient.refreshToken
    },
    projectId: ContensisProjectId,
    rootUrl: ContensisInstanceUrl
  });

  managementApiClient.bearerToken = transientClient.bearerToken;
  managementApiClient.bearerTokenExpiryDate = transientClient.bearerTokenExpiryDate;
  managementApiClient.refreshToken = transientClient.refreshToken;
  managementApiClient.refreshTokenExpiryDate = transientClient.refreshTokenExpiryDate;

  cookies.set(
    ContensisRefreshTokenCookieName,
    managementApiClient.refreshToken,
    {
      expires: managementApiClient.refreshTokenExpiryDate
    });

  return managementApiClient;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      managementApiClient: new Client(Client.defaultClientConfig),
      projects: [],
      currentUser: null
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    if (this.state.projects.length === 0) {
      this.refreshData();
    }
  }

  handleLogin(username, password) {
    createContensisManagementApiClient(username, password)
      .then(client => {
        this.setState({ managementApiClient: client });
        this.refreshData();
      });
  }

  refreshData() {
    return ensureContensisManagementApiClient(this.state.managementApiClient)
      .then(client => {
        this.setState({ managementApiClient: client });
        if (!client) {
          this.setState({
            currentUser: null,
            projects: []
          });
        } else {
          client.users.getCurrent()
            .then(currentUser => this.setState({ currentUser }));
          client.projects.list()
            .then(projects => this.setState({ projects }));
        }
      });
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>

            <hr />

            {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
            <Switch>
              <Route exact path="/">
                {!this.state.managementApiClient ? <Redirect to="/login" /> : <Home projects={this.state.projects} />}
              </Route>
              <Route path="/about">
                <About currentUser={this.state.currentUser} />
              </Route>
              <Route path="/login">
                {!!this.state.managementApiClient ? <Redirect to="/" /> : <Login onLogin={this.handleLogin} />}
              </Route>
            </Switch>
          </div>
        </Router>
      </div >
    );
  }
}

const Home = (props) => {
  return (
    <div>
      <h2>Home</h2>
      <p>Projects count: {props.projects?.length}</p>
    </div>
  );
}

const About = (props) => {
  return (
    <div>
      <h2>About</h2>
      <p>Current user: {props.currentUser?.userName}</p>
    </div>
  );
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleClick(evt) {
    this.props.onLogin(this.state.username, this.state.password);
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form>
          <div>
            <label>Username : </label>
            <input type="text" name="username" onChange={this.handleChange} />
          </div>
          <div>
            <label>Password : </label>
            <input type="password" name="password" onChange={this.handleChange} />
          </div>
          <div>
            <input type="button" value="Login" onClick={this.handleClick} />
          </div>
        </form>
      </div>
    );
  }
}

export default App;
