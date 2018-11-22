import React, { Component } from 'react';
//import { withRouter } from 'react-router';
// .weekDays-selector input {
//   display: none!important;
// }

// .weekDays-selector input[type=checkbox] + label {
//   display: inline-block;
//   border-radius: 6px;
//   background: #dddddd;
//   height: 40px;
//   width: 30px;
//   margin-right: 3px;
//   line-height: 40px;
//   text-align: center;
//   cursor: pointer;
// }

// .weekDays-selector input[type=checkbox]:checked + label {
//   background: #2AD705;
//   color: #ffffff;
// }

//sign up from component with states
export const WorkDaysForm = props => {
  return (
    <span>
    <input id = {props.id} onChange = { e => props.onCheck(e.target.id, e.target.value, e.target.checked )} type="checkbox"
     value={props.value} checked= {props.workDay}/> { props.value }
    </span>
    
    )
}
//const SignupFormWithRouter = withRouter(SignupForm);

export default WorkDaysForm;