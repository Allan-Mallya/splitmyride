import React, { Component } from 'react';
import { withRouter } from 'react-router';

class WorkHoursForm extends Component{

	render(){
		const {
			workHours,
			onSubmit,
			history
		} = this.props;

	console.log(workHours);

	return(
		<div>
		What are your office Hours?

		<br/>

		From: <input type='time' name='workstart' value={ workHours.start } />
		
		<br/>

		To: <input type= 'time' name="workend" value= { workHours.end } />
		
		<br/>
		<button type= 'button' onClick = {() =>{onSubmit();
											history.push('/app/user/me/profile') }}> Finish </button>

		</div>
		)
	}
}

const WorkHoursFormWithRouter = withRouter(WorkHoursForm)

export default WorkHoursFormWithRouter;