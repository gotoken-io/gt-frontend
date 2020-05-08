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

function createTime(time) {
  const stillUtc = moment.utc(time).toDate();
  return moment(stillUtc)
    .local()
    .format("MMMM D");
}

function TimeLine(time) {
  const stillUtc = moment.utc(time).toDate();
  return moment(stillUtc)
    .local()
    .format("MMMM DD,YYYY");
}

export default {
  datetime,
  fromNow,
  createTime,
  TimeLine
};
