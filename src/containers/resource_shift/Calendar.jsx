import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julia', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      selectedDays: [],
    };
  }

  componentWillReceiveProps(nextProps){
    if(this.props.markedDays)
      this.setState({selectedDays:this.props.markedDays});
    console.log(this.props);
    console.log(nextProps);
  }

  date_sort_asc(date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  }
  date_sort_desc(date1, date2) {
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  }


  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    if(this.props.order){
      if(this.props.order == 'asc')
        selectedDays.sort(this.date_sort_asc);
      else
        selectedDays.sort(this.date_sort_desc);
    }
    this.setState({ selectedDays });
    this.props.save_days(selectedDays);
  }
  render() {
    return (
      <div>
        <DayPicker
          locale="pt"
          months={MONTHS}
          weekdaysLong={WEEKDAYS_LONG}
          weekdaysShort={WEEKDAYS_SHORT}
          selectedDays={this.state.selectedDays}
          onDayClick={this.handleDayClick}
        />
      </div>
    );
  }
}