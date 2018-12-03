import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'
import Modal from './modal'
import TableData from './TableData'

export default class Portfolio extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: 1000,
			stocks : [{
				ticker: 'AAPL',
				amount: 10,
				value: 1000,
				toBeDeleted: false,
			}],
			currentExchangeRate: 1, //Stocks api returns value as USD by default
			currency: '$',
			show: false		//Modal showing or not, default state false
		}
	}


	render() {
		return(
			<div className="portfolio">
				{/* This modal will be triggered on or off when user clicks Add Stock*/}
				<Modal 
					show={this.state.show} 
					onClose={this.showModal} 
					onAdd={this.addStock}>
				</Modal>

				<button onClick={() => this.props.onRemove(this.props.name)}>Remove portfolio</button>

				<label htmlFor="radio">USD</label>
				<input className="radio" type="radio" defaultChecked name={this.props.name} value="USD" onChange={this.handleCurrencyChange}/>
				<label htmlFor="radio">EUR</label>
				<input className="radio" type="radio" name={this.props.name} value="EUR" onChange={this.handleCurrencyChange}/>

				<h1>{this.props.name}</h1>

				<TableData 
					data={this.state.stocks}
					onChange={this.handleChecked}
					exchangeRate={this.state.currentExchangeRate}
					currency={this.state.currency}
				/>
				
				<button onClick={this.showModal}>Add Stock</button>
				<button onClick={this.deleteStocks}>Remove Selected Stocks</button>

				<h3>{"Portfolio value: " + (this.state.value*this.state.currentExchangeRate).toFixed(2) + this.state.currency}</h3>
			</div>
		)
	}

	addStock = (ticker, amount) => {
		console.log(`ticker: ${ticker}   amount: ${amount}`);

		const API_KEY = "CH6O6Y963H07848Q"
		let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`

		fetch(url)
			.then(response => {
				return response.json()

			.then(json => {
				let lastRefreshed = json['Meta Data']['3. Last Refreshed']
				let dailyValues = json['Time Series (Daily)']
				for(let key in dailyValues) {				
					if(key === lastRefreshed){
						let closeValue = parseFloat(dailyValues[key]['4. close'])
						this.updateStocks(ticker, amount, closeValue)

		
					}
				}	
				
			})

			.catch(error => {
				// alert(`Ticker ${ticker} could not be found. Please give a valid ticker name.`)
				// alert(error)
			})

		})
		
	}

	updateStocks = (ticker, amount, closeValue) => {

		//If stock already exists in portfolio, update it's amount and value
		//Otherwise add it entirely
		let stocks = this.state.stocks
		let alreadyExists = false

		stocks.forEach((stock, index) => {
			if(stock.ticker === ticker) {
				alreadyExists = true
				stocks[index].amount += amount
				stocks[index].value = stocks[index].amount * closeValue
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
					amount: amount,
					value: amount * closeValue,
					toBeDeleted: false,
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
	showModal = () => {
		this.setState(({
			show: !this.state.show
		}))
	}

	//Make stock checked for deletion when checkbox is checked
	handleChecked = (e) => {
		let index = e.target.value
		let stocks = this.state.stocks
		stocks[index].toBeDeleted = !stocks[index].toBeDeleted
		this.setState(({
			stocks : stocks
		}))
		
	}

	//Remove all stocks checked for deletion
	deleteStocks = () => {
		let stocks = this.state.stocks
		let newStocks = []
		stocks.forEach((stock, index) => {
			if(stock.toBeDeleted === false){
				newStocks.push(stock)
			}
		})

		let value = this.calcNewPortfolioValue(newStocks)

		//update state
		this.setState({
			stocks: newStocks,
			value: value
		})

	}

	handleCurrencyChange = (e) => {
		let exchangeRate = null
		let currency = null

		if(e.target.value === 'USD'){
			exchangeRate = 1
			currency = '$'
		}
		else if (e.target.value === 'EUR'){
			exchangeRate = this.props.euroExchangeRate
			currency = '€'
		}

		//This will trigget a rerender with the updated stocks and portfolio values in the selected currency
		this.setState({
			currentExchangeRate: exchangeRate,
			currency: currency
		})
	}

} // end of Portfolio


Portfolio.propTypes = {
	name: PropTypes.string.isRequired,
	onRemove: PropTypes.func.isRequired
}