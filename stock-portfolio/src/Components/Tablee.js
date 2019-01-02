import React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'antd'


//Stock, quantity, total value
const columns = [{
    title: "Stock",
    dataIndex: 'stock',
    width:100,
}, {
    title: "Quantity",
    dataIndex: 'quantity',
    width:100
}, {
    title: "Individual value",
    dataIndex: "individualValue",
    width: 150
},{
    title: "Total Value",
    dataIndex: 'totalValue'
}]

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

export default class Tablee extends React.Component {

    render() {
        let data = this.createDataObject(this.props.stocks, this.props.exchangeRate, this.props.currency)

        return(

            <div id="table-container">
                <Table rowSelection={rowSelection} 
                    columns={columns} 
                    dataSource={data}
                    size="small"
                    scroll={{ y: 150 }}
                    pagination={false}
                    defaultExpandAllRows={true}>
                </Table>
            </div>
        )
    }

    createDataObject = (stocks, exchangeRate, currency) => {
        //ticker, amount, value  
        return stocks.map((element, index) => {
            return {
                stock: element.ticker,
                quantity: element.amount,
                individualValue: (element.closeValue * exchangeRate).toFixed(2) + currency,
                totalValue: (element.value * exchangeRate).toFixed(2) + currency,
                key: index
            }
        });

    }
}

Tablee.propTypes = {
	exchangeRate : PropTypes.number.isRequired,
    currency : PropTypes.string.isRequired,
    stocks: PropTypes.array.isRequired,
	handleChecked : PropTypes.func.isRequired,
}