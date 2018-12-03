import React from 'react'
import '../index.css'
import Portfolio from './Portfolio'

export default class PortfolioContainer extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			portfolios: [],
			euroExchangeRate: null
		}

	}

	componentDidMount() {
		this.getCurrencyExchangeRates()
	}

	render() {
		return (
			<div id="portfolio-container">
				<button id="add-portfolio-button" onClick={this.createNewPortfolio}>Add new portfolio</button>
				{/* <Portfolio name={"teppo"} onRemove={this.removePortfolio} euroExchangeRate={this.state.euroExchangeRate}/> */}
				<div>
					{
						this.state.portfolios.map((item, index) => (
							<Portfolio
								name={item.name} 
								onRemove={this.removePortfolio}  
								key={index}
								euroExchangeRate={this.state.euroExchangeRate}
							
							/>
						))
					}

				</div>
			</div>
		)
	}

	createNewPortfolio = () => {

		if(this.state.portfolios.length === 10) {
			alert("You can't create more than 10 portfolios")
			return;
		}

		let portfolioName = prompt("Please enter the name of the portfolio")
		let portfolio = {
			name: portfolioName,
		}

		let exists = false
		//Check if portfolio with same name already exists
		this.state.portfolios.forEach(portfolio => {
			if(portfolio.name === portfolioName){
				alert("A portfolio with the same name already exists. Please give another name.")
				exists = true
			}
		})

		//Don't add portfolio
		if(exists) return
		
		this.setState(prevState => ({
			portfolios: [...prevState.portfolios, portfolio]
		}))
	}

	removePortfolio = (portfolioName) => {
		let tempArr = this.state.portfolios
		let newArr = []

		tempArr.forEach((portfolio, index) => {
			if (portfolioName !== portfolio.name) {
				newArr.push(portfolio)
			}
		})
		
		// Update state
		this.setState(({
			portfolios: newArr
		}))
	}

	// Stock API returns in USD, get the exchange rate (USD*exrate) = EUR
	getCurrencyExchangeRates = () => {
		fetch('https://api.exchangeratesapi.io/latest?symbols=USD')
			.then((response) => {
				return response.json()
			})

			.then((json) => {
				this.setState(({
					euroExchangeRate: (1 / parseFloat(json.rates.USD))
				}))
			})
		}
}