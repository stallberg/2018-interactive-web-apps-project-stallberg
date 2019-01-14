import React from 'react'
import Portfolio from './Portfolio'
import {Button, Row, Col} from 'antd'
import SimpleStorage from "react-simple-storage";


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
				{/* <SimpleStorage parent={this} /> */}
				<Button id="add-portfolio-button"
						type="primary"
						onClick={this.createNewPortfolio}
				>
				Add new portfolio
				</Button>
				<div>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32, xl: 40 }} type="flex" justify="center" align="middle">
					{
						this.state.portfolios.map((item, index) => (
							<Col key={index} xs={24} sm={24} md={24} lg={12} xl={10}>
								<Portfolio
									name={item.name} 
									onRemove={this.removePortfolio}  
									euroExchangeRate={this.state.euroExchangeRate}
							
								/>
							</Col>
						))
					}
					</Row>
				</div>
			</div>
		)
	}

	createNewPortfolio = () => {

		if(this.state.portfolios.length === 10) {
			alert("You can't create more than 10 portfolios")
			return;
		}

		let portfolioName = ""
		while(portfolioName === ""){
			portfolioName = prompt("Please enter the name of the portfolio")
		}
		
		if(portfolioName === null) return	// user clicks cancel
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

		tempArr.forEach((portfolio) => {
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