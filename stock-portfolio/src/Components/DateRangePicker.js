import React from 'react'
import {DatePicker} from 'antd'
import moment from 'moment';
const { RangePicker } = DatePicker;


export default class DateRangePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dateFormat: 'DD/MM/YYYY',
        }
    }

    render() {
        return(
            <div id="date-picker">
                <RangePicker
                defaultValue={[moment(this.props.startDate, this.state.dateFormat), moment(this.props.endDate, this.state.dateFormat)]}
                format={this.state.dateFormat}
                showTime={{hideDisabledOptions: true}}
                disabledDate={this.disabledDate}
                onChange={this.onChange}
                />
            </div>
        )
    }

    onChange = (dates, dateStrings) => {
        // console.log(dates);
        // console.log(dateStrings); 
    }

    disabledDate = (current) => {
        //console.log(current && current < moment().endOf('day'));
        
        return current && current < moment(this.props.startDate, this.state.dateFormat)
            
        
   }
    
}
