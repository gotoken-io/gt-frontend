import moment from 'moment';

function datetime(time) {
  const stillUtc = moment.utc(time).toDate();
  return moment(stillUtc)
    .local()
    .format('YYYY-MM-DD HH:mm:ss');
}

function fromNow(time) {
  const stillUtc = moment.utc(time).toDate();
  return moment(stillUtc)
    .local()
    .fromNow();
}

export default {
  datetime,
  fromNow,
};
