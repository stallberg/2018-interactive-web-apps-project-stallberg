import React from 'react'
import PropTypes from 'prop-types'
import {Modal, Input, message} from 'antd'

export default class AddStockModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ticker : "",
            amount : "",
        }
    }

    render() {
        if (!this.props.show) {
            return null
        }
        return(

            <div>
                <Modal
                    title="Add Stock"
                    visible={this.props.show}
                    onOk={this.addStock}
                    okText="Add"
                    onCancel={this.props.onClose}
                    cancelText="Cancel"

                >

                <Input 
                    className="add-modal-input" 
                    placeholder="Enter stock symbol" 
                    onInput={e => this.setTicker(e)} 
                    autoFocus 
                    />
                <Input 
                    className="add-modal-input" 
                    placeholder="Enter amount"
                    onInput={e => this.setAmount(e)}
                    onKeyPress={e => this.onKeyPress(e)}
                    type="number"
                    min="1"
                    />
                
                </Modal>

            </div>
        )
    }

    setTicker = (e) => {
        e.target.value = e.target.value.toUpperCase() 
        this.setState({
            ticker : e.target.value
        })
    }

    setAmount = (e) => {
        //Input can't start with 0
        if(this.state.amount === "" && parseInt(e.target.value) === 0) {
            e.target.value = ""
            return
        }
        this.setState({
            amount : e.target.value
        })
    }

    addStock = () => {
		if(this.state.ticker === "" || this.state.amount === ""){
            //alert("Please input the ticker and amount")
            message.info("Please input the ticker and amount")
			return
		}

		this.props.onAdd(this.state.ticker.toUpperCase(), parseInt(this.state.amount))
        this.props.onClose()
        
		// Reset the ticker and amount values
        this.setState({
            ticker: "",
            amount: "",
            })

    }

    //Only 0-9
    onKeyPress = e => {
        let valid = /^\d*$/.test(e.key);
        if(!valid) e.preventDefault()
        
        
        
    }

    inputIsValid = () => {
		if(this.state.ticker === "" || this.state.amount === ""){
            message.info("Please input the ticker and amount")
			return false
        }    
    }

}

AddStockModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
}