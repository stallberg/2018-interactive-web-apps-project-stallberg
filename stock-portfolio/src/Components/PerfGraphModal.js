import React from 'react'
import PropTypes from 'prop-types'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts'
import {Modal} from 'antd'
import DatePicker from './DateRangePicker'

export default class PerfGraphModal extends React.Component {

	constructor(props) {
		super(props)
		
		this.state = {}
	}

	render() {
		
		if (!this.props.show) {
			return null
		}

		let data = this.generateChartDataList(this.props.stocks)
		let dataKeys = this.generateChartDataKeys(this.props.stocks)
		let startDate = this.props.stocks[0]['history'][0]['date']
		let endDate = this.props.stocks[0]['history'][99]['date']
		// TODO: fix properly
		

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
				<div id="perf-graph">
					<LineChart width={600} height={400} data={data}>
						{
							dataKeys.map((item, index) => (
								<Line
									type="monotone"
									dataKey={item}
									key={index}
									dot={false}
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
				</div>

					<DatePicker
						startDate={startDate}
						endDate={endDate}
					>
					</DatePicker>
				

				</Modal>
				</div>





		)
	}

	generateChartDataList = (stocks) => {
		 //all stock historys are the same length, pick one
		let historyLength = stocks[0]['history'].length
		let stocksLength = stocks.length
		let data = []
		
		for(let i = 0; i < historyLength; i++) {
			let obj = {date: stocks[0]['history'][i]['date']}
			for(let j = 0; j < stocksLength; j++) {
				obj[stocks[j].ticker] = stocks[j]['history'][i]['value']
			}
			data.push(obj)
		}
		return data
	}

	generateChartDataKeys = (stocks) => {
		return stocks.map(stock => {
			return stock.ticker
		})
	}

	generateRandomHexadecimalColor = () => {
		return "#" + Math.random().toString(16).slice(2, 8)
	}




}

PerfGraphModal.propTypes = {
	stocks: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
}