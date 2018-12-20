import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'


const backdropStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 50
}

const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: 5,
    maxWidth: 500,
    minHeight: 300,
    margin: '0 auto',
    padding: 30,
    position: "relative",
}

const footerStyle = {
    position: "absolute",
    bottom: 20
}


export default class AddStockModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ticker : null,
            amount : null,
        }
    }

    render() {
        if (!this.props.show) {
            return null
        }
        return(
            <div style={backdropStyle}>
                <div style={modalStyle}>
                    <label htmlFor="ticker">Ticker: </label>
                    <input id="ticker" type="text" onChange={e => this.setTicker(e)} autoFocus />
                    <br></br>
                    <label htmlFor="ticker-amount">Amount: </label>
                    <input id="ticker-amount" type="text" onChange={e => this.setAmount(e)} />

                    <div style={footerStyle}>
                        <button onClick={() => {this.props.onClose()}}>
                        Close
                        </button>
                        <button onClick={this.addStock}>
                            Add stock
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    setTicker = (e) => {
        this.setState({
            ticker : e.target.value
        })
    }

    setAmount = (e) => {
        this.setState({
            amount : e.target.value
        })
    }

    addStock = () => {

		if(this.state.ticker === null || this.state.amount === null){
			alert("Please input the ticker and amount")
			return
		}

		this.props.onAdd(this.state.ticker.toUpperCase(), parseInt(this.state.amount))
		
		// Reset the ticker and amount values
        this.props.onClose()
        this.setState({
            ticker: null,
            amount: null,
            })
        
	

    }

}

AddStockModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
}