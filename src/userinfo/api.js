import request from 'superagent/superagent';

import requestHandle from '../utils/requestHandle';

const infopath = '/tracker/info.php';
const bonuspath = '/tracker/bonus.php';
const signinpath = '/take_signin_bonus.php';

export const getBasicInfo = fn => request
  .get(infopath)
  // .accept('json')
  .query({ info: 'user', type: 'simple' })
  .end(requestHandle(fn));

export const getTrackerInfo = fn => request
  .get(infopath)
  // .accept('json')
  .query({ info: 'tracker' })
  .end(requestHandle(fn));

export const getUnread = fn => request
  .get(infopath)
  // .accept('json')
  .query({ info: 'unread' })
  .end(requestHandle(fn));

export const getSignInfo = fn => request
  .get(infopath)
  // .accept('json')
  .query({ info: 'sign', type: 'view' })
  .end(requestHandle(fn));

export const signin = fn => request
  .get(signinpath)
  .query({ sign: '1' })
  .end(requestHandle(fn));

export const clearTracker = fn => request
  .get(infopath)
  .query({ info: 'tracker', type: 'clean' })
  .end(requestHandle(fn));

export const exchangeBonus = (fn, num) => request
  .get(bonuspath)
  .query({ method: 'exchange', n: num })
  .end(requestHandle(fn));

export const exchangeHp = (fn, num) => request
  .get(bonuspath)
  .query({ method: 'exchange', n: num, heal: 'hp' })
  .end(requestHandle(fn));
