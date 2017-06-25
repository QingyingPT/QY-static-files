/**
 * this is a simple implement of debounce.
 */

export default (fn, delay, opts = {}) => {
  let timer;
  let last;
  let lastArgs;
  let lastExecTime = 0;

  const start = Boolean(opts.start);
  const end = 'end' in opts ? Boolean(opts.end) : true;

  const wait = +delay || 0;
  const maxCtrl = Boolean(opts.max);
  const max = +opts.max || 0;

  const execute = (time) => {
    const args = lastArgs;
    lastExecTime = time;
    lastArgs = undefined;
    return fn(...args);
  };

  const checkExpired = (time) => {
    const timegap = time - last;
    const timediff = time - lastExecTime;

    return (last === undefined
      || timegap < 0
      || timegap >= wait
      || (maxCtrl && (timediff >= max))
    );
  };

  const diffWait = (time) => {
    const timegap = time - last;
    const timediff = time - lastExecTime;

    return maxCtrl
      ? Math.min(wait - timegap, max - timediff)
      : wait - timegap;
  };

  const timerHandle = () => {
    const time = Date.now();

    if (checkExpired(time)) {
      timer = undefined;

      if (end && lastArgs) {
        execute(time);
        return;
      }

      lastArgs = undefined;
      return;
    }

    timer = setTimeout(timerHandle, diffWait(time));
  };

  const debounce = (...args) => {
    const time = Date.now();

    lastArgs = args;

    if (checkExpired(time)) {
      last = time;

      if (timer === undefined) {
        // first call
        lastExecTime = time;
        timer = setTimeout(timerHandle, wait);
        if (start) {
          return execute(time);
        }
      }
      if (maxCtrl) {
        timer = setTimeout(timerHandle, wait);
        return execute(time);
      }
    }

    last = time;

    if (timer === undefined) {
      timer = setTimeout(timerHandle, wait);
    }
    return undefined;
  };

  debounce.abort = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = undefined;
    last = undefined;
    lastExecTime = 0;
  };

  return debounce;
};
