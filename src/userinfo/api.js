import request from 'superagent';

import requestHandle from '../utils/requestHandle';

const infopath = '/tracker/info.php';

export const getBasicInfo = fn => request
  .get(infopath)
  .query({ info: 'user', type: 'simple' })
  .end(requestHandle(fn));

export const getTrackerInfo = fn => request
  .get(infopath)
  .query({ info: 'tracker' })
  .end(requestHandle(fn));

export const getUnread = fn => request
  .get(infopath)
  .query({ info: 'unread' })
  .end(requestHandle(fn));

export const getSignInfo = fn => request
  .get(infopath)
  .query({ info: 'sign', type: 'view' })
  .end(requestHandle(fn));
