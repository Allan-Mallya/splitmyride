import React, { Component } from 'react';
import { BrowserRouter as Router,Route,Switch,Link } from 'react-router-dom';
import {withRouter } from 'react-router';
import logo from './logo.svg';
import './App.css';
import API from './API.js';
import SignupFormWithRouter from './SignupForm';
import SigninFormWithRouter from './SigninForm';
import UserProfile from './UserProfile';
import LocationFormWithRouter from './GoogleMapsAPI';
import WorkDaysForm from './workDaysForm';
import WorkHoursForm from './workHoursForm';
import MatchMyRide from './MatchMyRide';

const Protected = ({ authenticated, children }) => (
  authenticated ? children : null);

class App extends Component {

  constructor(props){
    
    super(props);

    const access_token = window.localStorage.getItem('access_token');


    this.state = {
      access_token,
      currentUser: null,
      user: null,
      matches: [],
      signUpForm:{
        displayName:'Bison',
        email: 'Bison@Nothing.com',
        password: 'generalmbison'
      },
      signInForm:{
        email:'alice@test.com',
        password: '1234'
      }
    };
    this.api = API(access_token);
  }

  componentDidUpdate(){

     const {access_token} = this.state;

      window.localStorage.setItem('access_token', access_token);
  }

  componentDidMount(){
    const {access_token, currentUser } = this.state;

    access_token && this.loadCurrentUser();

  }


  onNameUpdate(form, displayName){
      
      const previousForm = this.state[form];

      const { signUpForm } = this.state;

      const updatedForm = Object.assign({},previousForm,{ displayName });

      this.setState({
            [form]: updatedForm,
      });
  }

  onEmailUpdate(form, email) {

      const previousForm = this.state[form];

      const { signUpForm } = this.state;

      const updatedForm = Object.assign({},previousForm,{ email });

      this.setState({
           [form]: updatedForm,
      });

  }

  onPasswordUpdate(form, password) {
      const previousForm = this.state[form];

      const { signUpForm } = this.state;

      const updatedForm = Object.assign({},previousForm,{ password });

      this.setState({
            [form]: updatedForm,
      });

  }

  onSignUpSubmit() {
    const { signUpForm } = this.state;

    this.api.post({
          endpoint : 'signup',
          body: {
            displayName: signUpForm.displayName,
            email: signUpForm.email,
            password: signUpForm.password
          },
        })
        .then(({access_token})=>
          {
            //save the access token to local storage
            this.setState({
                access_token
              });

            this.setState({
                currentUser: {
                displayName: signUpForm.displayName,
                email: signUpForm.email,
              }
            })
          })
          .catch(err => console.log(err));
    
    }


  onPersonalDetailsSubmit(){
    const { signUpForm } = this.state;

    this.setState({
      currentUser:{
        displayName: signUpForm.displayName,
        email: signUpForm.email,
        password: signUpForm.password
      }
    })

  }

  onLocationSubmit(homecoords,workcoords)
  {
    //const { homecoords } = this.state;

    console.log(this.state.currentUser);
    //save selected coordinates and load default schedule for next component
    this.setState({
      currentUser:{
      ...this.state.currentUser,
        location:{
          homeCoords:homecoords,
          workCoords: workcoords
        },
        workDays:[
          {id: 0, value: 'Mon', workDay: true},
          {id: 1, value:'Tue', workDay: true},
          {id: 2, value: 'Wed', workDay: true},
          {id: 3, value: 'Thu', workDay: true},
          {id: 4, value: 'Fri', workDay: true},
          {id: 5, value: 'Sat', workDay: false},
          {id: 6, value: 'Sun', workDay: false}
          ],
        workHours:{
          start: '09:00',
          end: '17:00'
          },
        },
      }, ()=>{ console.log(this.state.currentUser)})
  
  }

  onWorkDaysChange (index,value,checked) {
    //handle the action of a day check box

    const { currentUser } = this.state;

    currentUser.workDays.splice(index, 1, {id:parseInt(index), value: value, WorkDay:checked})
    //console.log(index);
    //console.log(index, checked);
    this.setState({
      schedule: [
      ...currentUser.workDays,
      ]
      //schedule[index].isChecked = checked;
    },()=>console.log(this.state.currentUser))
  }

  onHoursChange(){

  }

  onScheduleSubmit(){

    const { currentUser } = this.state;

    this.api.post({
          endpoint : 'signup',
          body: {
            ...currentUser
          },
        })
        .then(({access_token})=>
          {
            //save the access token to local storage
            this.setState({
              ...currentUser
            });
            this.setState({
                access_token
              });
          })
          .catch(err => console.log(err));

  }

  onSignInSubmit() {
    const { 
            signInForm: {
              email,
              password
          },
        } = this.state;

        this.api.post({
          endpoint : 'login',
          body: {
            email,
            password
          }
        })
          .then(({access_token})=>
            {

              //save the access token to local storage
              this.setState({
                  access_token
                });

              this.api = API(access_token);
              
              this.loadCurrentUser();

             })
              .catch(err => console.log(err));
  }


  loadCurrentUser() {
    this.loadUser({id: 'me'});
  }

  loadUser(id) {

    const userField = id === 'me' ? 'currentUser' : 'user';

    this.setState({
      [userField]: false,
    })

    this.api.get({
          endpoint : `api/users/me/$(id)`
        })  
          .then((currentUser)=>{

            console.log(currentUser);

                this.setState({
                    currentUser : {
                      ...currentUser
                    },
                 })
               });
  }

  loadMatches(){
    this.api.get({
      endpoint: 'api/matchmyride',
    }).then(({matches}) => {
      this.setState(state => ({
        ...state,
        matches,
      }));
    });
  };

  render() {

    const {
            currentUser,
            user, 
            signUpForm, 
            signInForm, 
            matches 
          } = this.state;
    
    return (
      <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Split My Ride</h1>
        </header>
        <ul>
          <li><Link to="/app/signin">Sign In</Link></li>
          <li><Link to="/app/signup">Sign Up</Link></li>
          <Protected authenticated = { !!currentUser}>
            { currentUser && <li><Link to="/app/user/me/profile"> {currentUser.displayName } </Link> </li> }
          </Protected>
          <Protected authenticated = { !!currentUser}>
            <li><Link to="/app/matchmyride"> Match My Ride </Link> </li>
          </Protected>

        </ul>

        <div>
          <Route path = "/app/signup" render = {()=> (
            <SignupFormWithRouter
                state = {signUpForm}
                onNameUpdate={ this.onNameUpdate.bind(this) }
                onEmailUpdate={ this.onEmailUpdate.bind(this) }
                onPasswordUpdate={ this.onPasswordUpdate.bind(this) }
                onSubmit={ this.onPersonalDetailsSubmit.bind(this) }

            />

          )}/>

        <Route path = "/app/signuplocation" render={()=>(
            <LocationFormWithRouter 
            onSubmit = { this.onLocationSubmit.bind(this)}

          />

          )} />

      <Route path = "/app/signupschedule" render={()=>(
          
          <ul>
          {
            this.state.currentUser.workDays.map((days)=>{
              return(<WorkDaysForm onCheck = {this.onWorkDaysChange.bind(this)} {...days} />)
            })

          }
          </ul>

        )}/>

      <Route path="/app/signupschedule/dates" render = {()=>(
          
          
         <WorkHoursForm

          workHours = { this.state.currentUser.workHours }
          onSubmit = { this.onScheduleSubmit.bind(this) }
          />

        )} />


          
            <Route path = "/app/signin" render = {() => (
               <SigninFormWithRouter
                  state = {signInForm}
                  onEmailUpdate={ this.onEmailUpdate.bind(this) }
                  onPasswordUpdate={ this.onPasswordUpdate.bind(this) }
                  onSubmit={ this.onSignInSubmit.bind(this) }

              />
              )}/>

            <Route path ="/app/matchmyride" render = {()=>(
              <MatchMyRide
                matches = { matches }
                loadMatches = { this.loadMatches.bind(this) }
              />

              )}/>

          <Switch>  

            <Route path = "/app/user/me/profile"  render={ ()=>(
                <UserProfile user = {currentUser} />
              )} />
     
            <Route path = "/app/user/:me/profile" render={ ({match}) =>(
                <UserProfile 
                    user = { user } 
                    match = { match }
                    loadUser = { this.loadUser.bind(this) }
                    />
              )} />
          </Switch>
        
        </div>

        <div>
                
        </div>

      </div>
      </Router>
    );
  }
}

export default App;
