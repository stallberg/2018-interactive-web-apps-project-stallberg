import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import {Modal, DatePicker, message, Row} from 'antd'
import moment from 'moment';

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY'

export default class PerfGraphModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			startDate : "",
			endDate: "",
		}
	}

	render() {
		
		if (!this.props.show) {
			return null
		}

		//Every stock history has same lenght, so just picking first one
		let historySize = this.props.stocks[0]['history'].length
		let startDate, endDate
		
		//Use start and end sent via props until user has given own start and end dates
		if(this.state.startDate === "" && this.state.endDate === "") {
			startDate = this.props.startAndEndDates[0]
			endDate = this.props.startAndEndDates[1]
		}
		else {
			startDate = this.state.startDate
			endDate = this.state.endDate
		}

		//Required for the Rechart library
		let data = this.generateChartDataList(this.props.stocks, startDate, endDate)
		let dataKeys = this.generateChartDataKeys(this.props.stocks)

		return(
			<div>

				<Modal
					title="Performance Graph"
					visible={this.props.show}
					onOk={this.props.onClose}
					onCancel={this.props.onClose}
					width={"80%"}
					footer={null}
				>

				<ResponsiveContainer width="100%" height={600}>
					<LineChart data={data}>
						{
							dataKeys.map((item, index) => (
								<Line
									type="monotone"
									dataKey={item.ticker}
									key={index}
									dot={false}
									unit={this.props.currency}
									stroke={item.color}>
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
				
				{/* Date picker for selecting start and end date */}	
				<Row id ="date-picker-container" type="flex" justify="center">
				<RangePicker
					defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
					format={dateFormat}
					showTime={{hideDisabledOptions: true}}
					onOk={this.handleOk}
					ranges={{
							'Whole History': [moment(this.props.startAndEndDates[0], dateFormat), 
											moment(this.props.startAndEndDates[1], dateFormat)],
							'This Month': [moment().startOf('month'), moment().endOf('month')]
					}}
				/>
				</Row>

				</Modal>
			</div>

		)
	}

	// Data object for chart library
	generateChartDataList = (stocks, startDate, endDate) => {
		 //all stock historys are the same length, pick one
		let historyLength = stocks[0]['history'].length
		let stocksLength = stocks.length
		let exchangeRate = this.props.exchangeRate
		let data = []
		
		for(let i = 0; i < historyLength; i++) {
			let date = stocks[0]['history'][i]['date']
			let inRange = this.isDateInRange(date, startDate, endDate)
			if(!inRange) continue

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
			return {
				ticker: stock.ticker,
				color: stock.color,
			}
		})
	}


   //When user clicks ok after selecting start and end date
	handleOk = (dates) => {
	   //No history exists outside the min and max range
	   let minDate = moment(this.props.startAndEndDates[0], dateFormat)
	   let maxDate = moment(this.props.startAndEndDates[1], dateFormat)

	   //If no history is found
	   if(dates[1] < minDate || dates[0] > maxDate) {
		   message.info(
			   `No historical data found between ${dates[0].format('DD/MM/YYYY')} and ${dates[1].format('DD/MM/YYYY')}`
			)
	   }

	   this.setState(({
		startDate: this.createEuropeanDateString(dates[0].toDate()),
		endDate: this.createEuropeanDateString(dates[1].toDate()),
		}))
	   
   }

   	createEuropeanDateString = (date) => {
		return date.getDate() + "/" + (date.getMonth() + 1) + "/"+date.getFullYear();
	}

	createDateObject = dateString => {
		let parts = dateString.split("/")
		return new Date(parts[2], parts[1] - 1, parts[0])
	}

	//Used to filter out data when choosing custom start and end date
	isDateInRange = (date, start, end) => {
		let d = this.createDateObject(date)
		let startDate = this.createDateObject(start)
		let endDate = this.createDateObject(end)

		if(d >= startDate && d <= endDate) {
			return true
		}
		return false	 
	}
}

PerfGraphModal.propTypes = {
	stocks: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	currency: PropTypes.string.isRequired,
	exchangeRate: PropTypes.number.isRequired,
	startAndEndDates: PropTypes.array
}