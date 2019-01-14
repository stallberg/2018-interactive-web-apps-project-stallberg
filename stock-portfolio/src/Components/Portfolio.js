import React from 'react'
import PropTypes from 'prop-types'
import AddStockModal from './AddStockModal'
import StocksTable from './StocksTable'
import PerfGraphModal from './PerfGraphModal';
import {message, Card, Popconfirm, Button, Radio, Row, Col} from 'antd'
import SimpleStorage from "react-simple-storage";



export default class Portfolio extends React.Component {

	constructor(props) {
		super(props)
		this.stocksTable = React.createRef()  //For the table component
		this.state = {
			value: 0,
			stocks : [],
			currentExchangeRate: 1, //Stocks api returns value as USD by default
			currency: '$',
			showAddStockModal: false,	//Modals showing or not, default state false
			showPerfGraphModal: false,
		}
	}

	render() {
		return(		
			<div>

			{/*For local storage */}
			<SimpleStorage parent={this} prefix={this.props.id} blacklist={['showAddStockModal', 'showPerfGraphModal']} />
			<Card 
				className="portfolio"
				title={this.props.name}
				style={{ width: "100%" }}
				extra={
				<Popconfirm title="Are you sure you want to delete the portfolio?" 
							okText="Yes" 
							cancelText="No"
							onConfirm={() => {
								this.props.onRemove(this.props.id)
							}
				}>
					<Button icon="close-circle" type="danger" id="remove-portfolio-btn">
					</Button>
				</Popconfirm>}	
			>
			

				
				{/* The modals. Hidden by default, and shows when buttons are pressed */}
				<AddStockModal 
					show={this.state.showAddStockModal} 
					onClose={this.showAddStockModal} 
					onAdd={this.addStock}>
				</AddStockModal>
				
				<PerfGraphModal
					stocks={this.state.stocks.filter(stock => stock.checked === true)}
					show={this.state.showPerfGraphModal}
					onClose={this.showPerfGraphModal}
					exchangeRate={this.state.currentExchangeRate}
					currency={this.state.currency}
				>
				</PerfGraphModal>
				
				{/* Currency selection */}
				<Radio.Group id="currency-selector" value={this.state.currency} onChange={this.handleCurrencyChange}>
					<Radio value="$">USD</Radio>
					<Radio value="€">EUR</Radio>
				</Radio.Group>
				
				{/* Table display for the stock information */}
				<StocksTable
					exchangeRate={this.state.currentExchangeRate}
					currency={this.state.currency}
					stocks={this.state.stocks}
					handleChecked={this.handleCheckedStocks}
					selectedRowKeys={this.getSelectedRows()}
					ref={this.stocksTable}
				></StocksTable>

				{/* Display portfolio value */}
				<h3>{"Portfolio value: " + (this.state.value*this.state.currentExchangeRate).toFixed(2) + this.state.currency}</h3>
				
				{/* Container for all the buttons */}
				<div id="buttons-container">
					<Button id="add-stock-btn" onClick={this.showAddStockModal}>Add Stock</Button>
					<Button id="perf-graph-btn" onClick={this.showPerfGraphModal} 
							disabled={!this.anyStocksChecked()}>
							Graph Of Selected
					</Button>
					<Button id="delete-selected-btn" onClick={this.deleteStocks}
							disabled={!this.anyStocksChecked()}>
							Remove Selected
					</Button>
				</div>
				

				


			</Card>
			</div>
		)
	}

	addStock = (ticker, amount) => {
		//debug purposes	
		console.log(`ticker: ${ticker}   amount: ${amount}`);

		const API_KEY = "CH6O6Y963H07848Q"
		let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`

		fetch(url)
			.then(response => {
				return response.json()

			.then(json => {
				//Given ticker does not exist, return from func
				if('Error Message' in json) {
					message.error(`Ticker ${ticker} could not be found. Please give a valid ticker name.`)
					return
				}
				
				//Get current stock value
				let dailyValues = json['Time Series (Daily)']
				let close = parseFloat(dailyValues[Object.keys(dailyValues)[0]]['4. close']);	

				//save historical data for performance graph
				let history = []
				for(let key in dailyValues) {				
					let closeValue = parseFloat(dailyValues[key]['4. close'])
					history.push({date: this.createEuropeanDate(key), value: closeValue})
				}

				this.updateStocks(ticker, amount, close, history)
			})

			.catch((error) => {
				console.log(error);
				
			})

		})
		
	}

	createEuropeanDate = (dateString) => {
		let date = new Date(dateString)
		return date.getDate() + "/" + (date.getMonth() + 1) + "/"+date.getFullYear();
	}

	updateStocks = (ticker, amount, closeValue, history) => {

		//If stock already exists in portfolio, update it's amount and value
		//Otherwise add it entirely
		let stocks = this.state.stocks
		let alreadyExists = false

		stocks.forEach((stock, index) => {
			if(stock.ticker === ticker) {
				alreadyExists = true
				stocks[index].closeValue = closeValue
				stocks[index].amount += amount
				stocks[index].value = stocks[index].amount * closeValue
				stocks[index].history = history.reverse()
				this.setState(() => ({
					stocks: stocks
				}))
			}
		})
		
		//If stock doesn't already exist in portfolio
		if(!alreadyExists){
			this.setState(prevState => ({
				stocks: [...prevState.stocks, {
					ticker: ticker,
					closeValue: closeValue,
					amount: amount,
					value: amount * closeValue,
					history : history.reverse(),
					checked: false,
					color: this.generateRandomHexadecimalColor()
				}]
			}))	
		}

		//Update the value of the portfolio when new stocks are added
		let value = this.calcNewPortfolioValue(this.state.stocks)
		this.setState({
			value: value
		})		
	}

	//Return the new portfolio value
	calcNewPortfolioValue = (stocksArr) => {
		let value = 0
		stocksArr.forEach(stock => {
			value += stock.value
		})

		return value
	}

	//Switch the modal state between showing and not showing
	showAddStockModal = () => {
		this.setState(({
			showAddStockModal: !this.state.showAddStockModal
		}))
	}

	showPerfGraphModal = () => {
		this.setState(({
			showPerfGraphModal : !this.state.showPerfGraphModal
		}))
	}

	handleCheckedStocks = indicies => {		
		let updatedStockArr = this.state.stocks

		updatedStockArr.forEach((element, index) => {
			if(indicies.includes(index)) {
				updatedStockArr[index].checked = !updatedStockArr[index].checked
			}
			else if(updatedStockArr[index].checked === true) {
				updatedStockArr[index].checked = !updatedStockArr[index].checked
			}
		});

		this.setState({
			stocks: updatedStockArr
		})
	}

	//Check if atleast one stock is checked
	//Used to determine whether graph and delete buttons are disabled or not
	anyStocksChecked = () => {
		for (let i = 0; i < this.state.stocks.length; i++) {
			if(this.state.stocks[i].checked === true) return true			
		}
		return false
	}

	getSelectedRows = () => {
		let rows = []
		this.state.stocks.forEach((stock, index) => {
			if(stock.checked === true){
				rows.push(index)
			}
		})
		return rows
	}


	//Remove all stocks checked for deletion
	deleteStocks = () => {
		let stocks = this.state.stocks
		let newStocks = []
		stocks.forEach(stock => {
			if(stock.checked === false){
				newStocks.push(stock)
			}
		})

		let value = this.calcNewPortfolioValue(newStocks)

		//update state
		this.setState({
			stocks: newStocks,
			value: value
		})

		//uncheck the selected rows in table
		this.stocksTable.current.clearCheckedRows()

	}

	handleCurrencyChange = (e) => {
		let exchangeRate = null
		let currency = null

		if(e.target.value === '$'){
			exchangeRate = 1
			currency = '$'
		}
		else if (e.target.value === '€'){
			exchangeRate = this.props.euroExchangeRate
			currency = '€'
		}

		//This will trigget a rerender with the updated stocks and portfolio values in the selected currency
		this.setState({
			currentExchangeRate: exchangeRate,
			currency: currency
		})
	}

	//For generating the graph colors for each stock
	generateRandomHexadecimalColor = () => {
		return "#" + Math.random().toString(16).slice(2, 8)
	}

} // end of Portfolio


Portfolio.propTypes = {
	name: PropTypes.string.isRequired,
	onRemove: PropTypes.func.isRequired,
	euroExchangeRate: PropTypes.number.isRequired,
}