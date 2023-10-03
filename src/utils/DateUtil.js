import moment from 'moment';

export default function DateUtil() {
  // moment.locale();  
  const StringToMoment = (date, format) => date ? moment(date).format(format) : null;
  const FormatDate = (date) => moment(date).format('ll');
  const GetDate = moment().format('yyyy-MM-DD');
  const GetDay = (date = GetDate) => moment(date).format('DD')
  const GetMonth = (date = GetDate) => moment(date).format('MM')
  const GetFirstDate = moment().startOf('month').format('yyyy-MM-DD');
  const GetAddDate = (str, format, days) => stringToMoment(str, format) ? stringToMoment(str, format).add(days, 'days').format(format) : null;
  const GetTotalDaysOfMonth = (date = GetDate) => moment(date).daysInMonth()
  const GetLastDayOfMonth = (date = GetDate) => {
    let dateFormat = parseInt(moment(date).format('yyyy')) + '-' + GetMonth(date) + '-' + GetTotalDaysOfMonth(date);
    return moment(dateFormat).format('yyyy-MM-DD')
  }

  return {
    FormatDate, 
    StringToMoment,
    GetDate,
    GetDay,
    GetMonth,
    GetFirstDate,
    GetAddDate,
    GetTotalDaysOfMonth,
    GetLastDayOfMonth
  }
}