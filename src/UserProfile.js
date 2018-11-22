import React, { Component } from 'react';
import {withRouter } from 'react-router';

//user profile component with state
class UserProfile extends Component{

  render(){

    //add user
    const { currentUser,user, match,loadUser } = this.props;
    console.log(user);
    console.log(currentUser);

    //var test = user && user.workDays.forEach(workday=>console.log(workday));


    if(user === null)
    {
      if(match && match.params.id)
      {
        loadUser({ id: match.params.id });
      }
    }



    if(user === null || user === false)
    {
      return (
        <div>
          <h2>Loading..</h2>
        </div>
      );
    }

    return (
      <div>
        <h2>User Profile</h2>

        <span>Hello { user.displayName }</span>
        <span> You work at on { } </span>



      </div>
      )
     
  }
}
 
const UserProfileWithRouter = withRouter(UserProfile);
export default UserProfile;