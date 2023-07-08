import moment from 'moment';

export default function DateUtil() {
  // moment.locale();  
  const FormatDate = (date) => moment(date).format('ll');
  return {FormatDate}
}
