import React, { Component } from 'react';
import { withRouter } from 'react-router';

//Sign in from compoenent with state
class SigninForm extends Component{
  render(){

    const {
      state: {
        email,
        password,
      },
      history,
      onEmailUpdate,
      onPasswordUpdate,
      onSubmit
    } = this.props;

    const FORM_NAME = "signInForm";

    return(
          <div>
            <h2>Sign In</h2>

           <div>
            
              <input type = "email" 
              onChange={e=> onEmailUpdate(FORM_NAME, e.target.value)}
              value = {email}
              placeholder = "Your email"/>

            </div>

            <div>

              <input type = "password" 
              onChange={e=> onPasswordUpdate(FORM_NAME, e.target.value)}
              value = {password}
              placeholder = "Your password"/>
            
            </div>

            <div>
              
              <button type="button"
              onClick ={ ()=>{ onSubmit(); history.push('/app/user/me/profile')} }>Continue</button>
            </div>
        </div>
      );
  }
}


const SigninFormWithRouter = withRouter(SigninForm);

export default SigninFormWithRouter;