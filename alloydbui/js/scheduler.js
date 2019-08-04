const { ipcRenderer } = require("electron");
const { CronJob } = require("cron");
const moment = require("moment");
const path = require("path");
var logger = {};
if (module.hot) { module.hot.accept(); }
var scheduler = {};

class Scheduler {
  constructor(env) {
    process.env = env;
    this.jobs = [];
    logger = require(path.join(process.env.APP_DIR, "common", "logger"));
    logger.info("scheduler", "scheduler started");
    ipcRenderer.send("scheduler-load-result", "success");
  }

  getSchedule() {
    logger.debug("scheduler", "getting schedule");
    var results = [];
    this.jobs.forEach((job) => {
      try {
        var lastDate = job.lastExecution === undefined ? "not yet run" : moment(job.lastExecution).local().format("hh:mm:ss a");
        var nextDate = job.nextDates().local().format("hh:mm:ss a MM/DD/YY");
        results.push({ name: job.name, running: job.running, callback: job.callback, source: job.cronTime.source, timezone: job.cronTime.zone, lastExecution: lastDate, nextExecution: nextDate });
      } catch (err) {
        log.error(JSON.stringify(err));
      }
    });
    return results;
  }
}

ipcRenderer.on("scheduler-start", (args, data) => {
  scheduler = new Scheduler(data);
});

ipcRenderer.on("scheduler-create-job", (args, data) => {
  logger.debug("scheduler", "adding job");
  var job = new CronJob(data.time, (data) => {
    ipcRenderer.send(jobInfo.callback);
    setTimeout(() => {
      ipcRenderer.send("scheduler-current-schedule", scheduler.getSchedule());
    }, 3000);
  }, null, true, moment.tz.guess());
  job.name = data.name;
  job.callback = data.callback;
  scheduler.jobs.push(job);
  ipcRenderer.send("scheduler-job-created", job);
  ipcRenderer.send("scheduler-current-schedule", scheduler.getSchedule());
});

ipcRenderer.on("scheduler-create-jobs", (args, data) => {
  logger.debug("scheduler", "adding job");
  data.forEach((jobInfo) => {
    var job = new CronJob(jobInfo.time, (data) => {
      ipcRenderer.send(jobInfo.callback);
      setTimeout(() => {
        ipcRenderer.send("scheduler-current-schedule", scheduler.getSchedule());
      }, 3000);
    }, null, true, moment.tz.guess());
    job.name = jobInfo.name;
    job.callback = jobInfo.callback;
    scheduler.jobs.push(job);
    ipcRenderer.send("scheduler-job-created", job);
  });
  ipcRenderer.send("scheduler-current-schedule", scheduler.getSchedule());
});

ipcRenderer.on("scheduler-get-schedule", (args, data) => {
  ipcRenderer.send("scheduler-current-schedule", scheduler.getSchedule());
});

ipcRenderer.on("scheduler-run-task", (args, data) => {
  scheduler.jobs.forEach((job) => {
    if (job.callback === data.callback) {
      job.lastExecution = new Date();
      job.fireOnTick();
      ipcRenderer.send("scheduler-current-schedule", scheduler.getSchedule());
    }
  });
});