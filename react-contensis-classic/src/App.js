import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

import './App.css';

import {Cookies, useCookies} from 'react-cookie';
import { Client } from 'contensis-management-api';
import { ContensisApplicationError, ContensisAuthenticationError } from 'contensis-core-api';

import axios from "axios";

// ideally the names of any access related cookies should be obfuscated to make their intention less visible
const ContensisRefreshTokenCookieName = 'ContensisRefreshToken';
const ContensisInstanceUrl = 'https://cms-trial-001.cloud.contensis.com';
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

async function createContensisManagementApiClient(cmsUrl, username, password) {
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
    rootUrl: cmsUrl
  });
  console.log('created client from user name and password');

  // any error at this point should be treated like a login error
  await transientClient.ensureBearerToken().catch(error => {
    if (error instanceof ContensisApplicationError) {
      console.log('The error is ContensisApplicationError:', error);
    }

    if (error instanceof ContensisAuthenticationError) {
      console.log('The error is ContensisAuthenticationError:', error);
    }

    throw error;
  });

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
  managementApiClient.contensisClassicToken = transientClient.contensisClassicToken;
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
      currentEntry: null,
      currentUser: null,
      redirect: false
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.clearIdentityCookies = this.clearIdentityCookies.bind(this);
    this.getEntry = this.getEntry.bind(this);
  }

  componentDidMount() {
    if (this.state.projects.length === 0) {
      this.refreshData();
    }
  }

  getEntry(entryId) {
    ensureContensisManagementApiClient(this.state.managementApiClient)
      .then(client => {
        this.setState({ managementApiClient: client });
        if (!client) {
          this.setState({
            currentUser: null,
            projects: [],
            currentEntry: null
          });
        } else {
          client.security.users.getCurrent()
              .then(currentUser => this.setState({ currentUser }));
          client.projects.list()
              .then(projects => this.setState({ projects }));
          client.entries.get(entryId)
              .then(x => this.setState({currentEntry: x}));
        }
      });
  }

  handleLogin(cmsUrl, username, password) {
    createContensisManagementApiClient(cmsUrl, username, password)
      .then(client => {
        this.setState({
          managementApiClient: client
        });
        this.refreshData();
      });
  }

  clearIdentityCookies() {
    const cookies = new Cookies();
    cookies.remove(ContensisRefreshTokenCookieName);
    this.setState({ managementApiClient: null });
    this.setState({ redirect: true });
  }

  refreshData() {
    return ensureContensisManagementApiClient(this.state.managementApiClient)
      .then(client => {
        this.setState({ managementApiClient: client });
        if (!client) {
          this.setState({
            currentUser: null,
            projects: [],
            currentEntry: null
          });
        } else {
          client.security.users.getCurrent()
            .then(currentUser => this.setState({ currentUser }));
          client.projects.list()
            .then(projects => this.setState({ projects }));
        }
      });
  }

  renderRedirect = () => {
    if(this.state.redirect) {
      return <Redirect to='/login' />
    }
  }

  render() {
    return (
      <div>
        <Router>
          {this.renderRedirect()}
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/entries">Entries</Link>
              </li>
              <li>
                <Link to="/currentIdentity">Current Identity</Link>
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
              <Route exact path="/projects">
                {!this.state.managementApiClient ? <Redirect to="/login" /> : <Projects projects={this.state.projects} />}
              </Route>
              <Route exact path="/entries">
                {!this.state.managementApiClient ? <Redirect to="/login" /> : <Entries currentEntry={this.state.currentEntry} onGetEntry={this.getEntry}/>}
              </Route>
              <Route path="/currentIdentity">
                <CurrentIdentity currentUser={this.state.currentUser} onClearIdentityCookies={this.clearIdentityCookies}/>
              </Route>
              <Route path="/login">
                {!!this.state.managementApiClient ? <Redirect to="/currentIdentity" /> : <Login onLogin={this.handleLogin} />}
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

class Projects extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectNames : props.projects.map(x => x.id)
    };
  }

  render() {
    return (
        <div>
          <h2>Projects</h2>
          <p>Projects count: {this.props.projects?.length}</p>
          <p>
            <ul>
              {this.state.projectNames.map(x => (<li key={x}>{x}</li>))}
            </ul>
          </p>
          <p>
          <pre>
            { JSON.stringify(this.props.projects, null, 2) }
          </pre>
          </p>
        </div>
    );
  }
}

class Entries extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entryId: null,
      currentEntry: null
    };
    if(props.currentEntry) {
      console.log("HAS CURRENT ENTRY: " + JSON.stringify(props.currentEntry, null, 2));
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(evt) {
    console.log("Entry id in form = " + evt.target.value);
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleClick(evt) {
    console.log("Entry id = " + this.state.entryId);
    this.props.onGetEntry(this.state.entryId);
  }

  render() {
    return (
        <div>
          <h2>Entries</h2>
          <form>
            <div>
              <label>Entry ID : </label>
              <input type="text" name="entryId" onChange={this.handleChange} />
            </div>
            <div>
              <input type="button" value="Get entry" onClick={this.handleClick} />
            </div>
          </form>
          <pre>
            { JSON.stringify(this.props.currentEntry, null, 2) }
          </pre>
        </div>
    );
  }
}

class CurrentIdentity extends Component {

  constructor(props) {
    super(props);
    this.render();
  }

  render() {
    return (
        <div>
          <h2>Current Identity</h2>
          <p>Current user: {this.props.currentUser?.userName}</p>
          <p>
            { JSON.stringify(this.props.currentUser, null, 2) }
          </p>
          <p>
            <input type="button" value="Clear current identity" onClick={this.props.onClearIdentityCookies} />
          </p>
        </div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmsUrl: '',
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
    this.props.onLogin(this.state.cmsUrl, this.state.username, this.state.password);
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form>
          <div>
            <label>CMS : </label>
            <input type="text" name="cmsUrl" onChange={this.handleChange} />
          </div>
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
