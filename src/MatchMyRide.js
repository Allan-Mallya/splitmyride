import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class MatchMyride extends Component{
	
	render()
	{
		const {
			matches,
		} = this.props
		
		return(
			<table>
				<tbody>
					{
						matches.map( match=> {
							<tr>
								<td>
								match.displayName
								</td>
								<td>
								<Link to = "app/user/ ${ match._id}">
								Show Details
								</Link>
								</td>
							</tr>




						})
					}
				</tbody>
			</table>		
			)
	}
}