import React, { isValidElement } from 'react'
import PropTypes from 'prop-types'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import {Modal, DatePicker} from 'antd'
import moment from 'moment';
import SimpleStorage from "react-simple-storage";

const { RangePicker } = DatePicker;



export default class PerfGraphModal extends React.Component {

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

		if(this.state.startDate === "" && this.state.endDate === "") {
			startDate = this.props.stocks[0]['history'][0]['date']
			endDate = this.props.stocks[0]['history'][historySize - 1]['date']
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
				{/* For local storage */}
				{/* <SimpleStorage parent={this} /> */}
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
					{/* </div> */}
					
					<div id="date-picker">
						<RangePicker
							defaultValue={[moment(startDate, 'DD/MM/YYYY'), moment(endDate, 'DD/MM/YYYY')]}
							format={'DD/MM/YYYY'}
							showTime={{hideDisabledOptions: true}}
							disabledDate={this.disabledDate}
							onChange={this.onChange}
							onOk={this.handleOk}
						/>
					</div>
				

				</Modal>
			</div>





		)
	}

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
			// if(stock.checked === true){
				return {
					ticker: stock.ticker,
					color: stock.color,
				}
			// }
		})
	}

	disabledDate = (current) => {
		//console.log(current && current < moment().endOf('day'));
		// return current && current < moment(this.state.startDate, this.state.dateFormat)       
   }

   //When user clicks ok after slecting start and end date
	handleOk = (dates) => {
	   let startDate = this.createEuropeanDateString(dates[0].toDate())
	   let endDate = this.createEuropeanDateString(dates[1].toDate())

	   this.setState(({
		startDate: startDate,
		endDate: endDate,
		}))
	//    console.log(startDate, endDate);
	   
   }

   	createEuropeanDateString = (date) => {
		return date.getDate() + "/" + (date.getMonth() + 1) + "/"+date.getFullYear();
	}

	createDateObject = dateString => {
		let parts = dateString.split("/")
		return new Date(parts[2], parts[1] - 1, parts[0])
	}


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
}