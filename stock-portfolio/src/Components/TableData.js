import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'


export default class TableData extends React.Component {
	render() {
		let exchangeRate = this.props.exchangeRate
		let currency = this.props.currency
		
		return(
			<table>
				<tbody>
					<tr>
						<th>Stock</th>
						<th>Amount</th>
						<th>Total stock value</th>
					</tr>
					{this.props.data.map((val, index) => {
						return(
							<tr key={index}>
								<td>{val.ticker}</td>
								<td>{val.amount}</td>
								<td>{(val.value * exchangeRate).toFixed(2) + currency}</td>
								<td><input type="checkbox" value={index} onChange={(e) => {this.props.handleChecked(e)}} ></input></td>
							</tr>
						)
					})}
					</tbody>
			</table>
		)
	}
}

TableData.propTypes = {
    exchangeRate : PropTypes.number.isRequired,
    currency : PropTypes.string.isRequired,
    handleChecked : PropTypes.func.isRequired,
}