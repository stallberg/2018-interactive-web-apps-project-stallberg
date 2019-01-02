import React from 'react'
import {DatePicker} from 'antd'
import moment from 'moment';
const { RangePicker } = DatePicker;


export default class DateRangePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        console.log(this.props.startDate);
        
        const dateFormat = 'DD/MM/YYYY';
        return(
            <div id="date-picker">
                <RangePicker
                defaultValue={[moment(this.props.startDate, dateFormat), moment(this.props.endDate, dateFormat)]}
                format={dateFormat}
                />
            </div>
        )
    }
    
}
