var CronJob = require('cron').CronJob;
var moment = require('moment');

function Scheduler() {
  this.jobs = [];
}

Scheduler.prototype.createJob = function createJob(name, time, callback) {
  var job = new CronJob(time, callback, null, true, moment.tz.guess());
  job.name = name;
  this.jobs.push(job);
};

Scheduler.prototype.getSchedule = function getSchedule() {
  var results = [];
  this.jobs.forEach(job => {
    try {
      var lastDate = job.lastExecution == undefined ? "not yet run" : moment(job.lastExecution).local().format("hh:mm:ss a");
      var nextDate = job.nextDates().local().format("hh:mm:ss a MM/DD/YY");
      results.push({ name: job.name, running: job.running, source: job.cronTime.source, timezone: job.cronTime.zone, lastExecution: lastDate, nextExecution: nextDate })
    } catch (err) {
      console.log(err);
    }
  });
  return results;
}

module.exports = Scheduler;