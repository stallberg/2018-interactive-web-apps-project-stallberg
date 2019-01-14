import React from 'react'
import PropTypes from 'prop-types'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import {Modal} from 'antd'
import DateRangePicker from './DateRangePicker'

export default class PerfGraphModal extends React.Component {

	constructor(props) {
		super(props)
		
		this.state = {}
	}

	render() {
		
		if (!this.props.show) {
			return null
		}

		//Required input to the Rechart library
		let data = this.generateChartDataList(this.props.stocks)
		let dataKeys = this.generateChartDataKeys(this.props.stocks)

		//Every stock history has same lenght, so just picking first one
		let historySize = this.props.stocks[0]['history'].length
		let startDate = this.props.stocks[0]['history'][0]['date']
		let endDate = this.props.stocks[0]['history'][historySize - 1]['date']

		return(
			<div>
				<Modal
					title="Performance Graph"
					visible={this.props.show}
					onOk={this.props.onClose}
					onCancel={this.props.onClose}
					width={800}
					footer={null}
				>
					{/* <div id="perf-graph"> */}
						<ResponsiveContainer width="100%" height={400}>
							<LineChart data={data}>
								{
									dataKeys.map((item, index) => (
										<Line
											type="monotone"
											dataKey={item}
											key={index}
											dot={false}
											unit={this.props.currency}
											stroke={this.generateRandomHexadecimalColor()}>
										</Line>
									))
								}
								<CartesianGrid stroke="#ccc" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip/>
								<Legend />
							</LineChart>
						</ResponsiveContainer>
					{/* </div> */}
					
					<div id="datepicker-container">
						<DateRangePicker
							startDate={startDate}
							endDate={endDate}
						>
						</DateRangePicker>
					</div>
				

				</Modal>
			</div>





		)
	}

	generateChartDataList = (stocks) => {
		 //all stock historys are the same length, pick one
		let historyLength = stocks[0]['history'].length
		let stocksLength = stocks.length
		let currency = this.props.currency
		let exchangeRate = this.props.exchangeRate
		let data = []
		
		for(let i = 0; i < historyLength; i++) {
			let obj = {date: stocks[0]['history'][i]['date']}
			for(let j = 0; j < stocksLength; j++) {
				obj[stocks[j].ticker] = (stocks[j]['history'][i]['value'] * exchangeRate).toFixed(2)
			}
			data.push(obj)
		}
		return data
	}

	//Data keys for the Rechart graph library
	generateChartDataKeys = (stocks) => {
		return stocks.map(stock => {
			return stock.ticker
		})
	}

	//For generating the graph colors
	generateRandomHexadecimalColor = () => {
		return "#" + Math.random().toString(16).slice(2, 8)
	}




}

PerfGraphModal.propTypes = {
	stocks: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	currency: PropTypes.string.isRequired,
	exchangeRate: PropTypes.number.isRequired,
}