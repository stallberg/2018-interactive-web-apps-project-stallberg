import React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'antd'

//Table headers
const columns = [{
	title: "Stock",
	dataIndex: 'stock',
	width:100,
}, {
	title: "Quantity",
	dataIndex: 'quantity',
	width:100
}, {
	title: "Value",
	dataIndex: "individualValue",
	width: 150
},{
	title: "Total Value",
	dataIndex: 'totalValue'
}]


export default class StocksTable extends React.Component {

	render() {
		let data = this.createDataObject(this.props.stocks, this.props.exchangeRate, this.props.currency)

		return(
			<div id="table-container">

				<Table rowSelection={
					{
						onChange: (keys, a, b) => {
							this.onSelectChange(keys)
							this.props.handleChecked(keys)
						},
						selectedRowKeys: this.props.selectedRowKeys,
					}
				} 
					columns={columns} 
					dataSource={data}
					size="small"
					scroll={{ y: 150 }}
					pagination={false}
					defaultExpandAllRows={true}>
				</Table>
			</div>
		)
	}

	createDataObject = (stocks, exchangeRate, currency) => {
		//ticker, amount, value  
		return stocks.map((element, index) => {
			return {
				stock: element.ticker,
				quantity: element.amount,
				individualValue: (element.closeValue * exchangeRate).toFixed(2) + currency,
				totalValue: (element.value * exchangeRate).toFixed(2) + currency,
				key: index
			}
		});
	}

	clearCheckedRows = () => {
		this.setState({
			selectedRowKeys: []
		})
	}

	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	  }
}


StocksTable.propTypes = {
	exchangeRate : PropTypes.number.isRequired,
	currency : PropTypes.string.isRequired,
	stocks: PropTypes.array.isRequired,
	handleChecked : PropTypes.func.isRequired,
	selectedRowKeys: PropTypes.array.isRequired
}