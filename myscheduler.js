
scheduler = false;

if (typeof setTimeout == 'undefined') {
  setTimeout = function (fn, delay) {
    if (scheduler == false) scheduler = [];
    var now = new Date().getTime();
    if (scheduler.length == 0) {
      scheduler.push({timeStamp: now, delay: delay, fn: fn});
    } else {
      for (var i = 0; i < scheduler.length; i++) {
        var remaining = now - scheduler[i].timeStamp + scheduler[i].delay;
        if (remaining > delay) {
          scheduler.splice(i, 0, {timeStamp: now, delay: delay, fn: fn});
          break;
        }
      }
    }
  }

  executeScheduler = function() {
    var now = new Date().getTime();
    for (var i = 0; i < scheduler.length; i++) {
      var remaining = now - scheduler[i].timeStamp + scheduler[i].delay;
      if (remaining >= 0) {
        scheduler[i].fn.call(this);
      } else {
        scheduler.splice(0,i);
        break;
      }
    }
  }
}