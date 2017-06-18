import * as api from './api';

const createScrollEndListener = (fn) => {
  let lastTimer = 0;

  const handle = (ev) => {
    clearTimeout(lastTimer);
    lastTimer = setTimeout(() => {
      fn(ev);
    }, 250);
  };

  window.addEventListener('scroll', handle);

  return () => window.removeEventListener('scroll', handle);
};

const drawAvatar = (con) => {
  const holder = document.createElement('section');
  holder.classList.add('userinfo-sticky-avatar');
  con.appendChild(holder);

  const img = document.createElement('img');
  holder.appendChild(img);

  return avatar => (img.src = avatar);
};

const drawDefaultLines = (con) => {
  const holder = document.createElement('section');
  const line1 = document.createElement('div');
  const line2 = document.createElement('div');

  line1.classList.add('userinfo-sticky-line');
  line2.classList.add('userinfo-sticky-line');

  holder.appendChild(line1);
  holder.appendChild(line2);
  con.appendChild(holder);

  const msgBtn = document.createElement('a');
  msgBtn.classList.add('userinfo-sticky-msg');
  msgBtn.href = '/messages.php';
  msgBtn.type = 'button';
  msgBtn.title = '点击查看';
  line1.appendChild(msgBtn);

  const signBtn = document.createElement('a');
  signBtn.classList.add('userinfo-sticky-sign');
  signBtn.href = '/take_signin_bonus.php?total_days=1';
  signBtn.type = 'button';
  signBtn.title = '点击签到';
  line2.appendChild(signBtn);

  return [
    (unread) => {
      if (unread) {
        msgBtn.appendChild(document.createTextNode(`有${unread}未读`));
        msgBtn.classList.add('important');
      } else {
        msgBtn.appendChild(document.createTextNode('收件箱'));
      }
    },
    (days) => {
      if (days > 0) {
        signBtn.appendChild(document.createTextNode(`已签${days}天`));
        signBtn.classList.add('disabled');
      } else {
        // TODO: 签到
        line2.appendChild(document.createTextNode('签到'));
      }
    },
  ];
};

const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add('userinfo-sticky-container');

  // find position
  const main = document.querySelector('.mainouter');
  const body = document.body;
  if (!main || !body) return null;

  const mainRect = main.getBoundingClientRect();
  const bodyRect = body.getBoundingClientRect();

  container.style.top = `${mainRect.top - bodyRect.top}px`;

  body.appendChild(container);

  createScrollEndListener(() => {
    const nMainRect = main.getBoundingClientRect();
    const nBodyRect = body.getBoundingClientRect();

    container.style.top = `${((nMainRect.top < 20) ? 20 : nMainRect.top) - nBodyRect.top}px`;
  });

  // TODO: 异步数据
  const fillAvatar = drawAvatar(container);
  const [fillMsg, fillSignDays] = drawDefaultLines(container);

  api.getBasicInfo((err, data) => {
    if (!err && data) {
      fillAvatar(data.avatar);
    }
  });

  api.getUnread((err, data) => {
    if (!err && data) {
      fillMsg(data);
    }
  });

  api.getSignInfo((err, data) => {
    if (!err && data) {
      fillSignDays((data.l > 0) ? data.t : 0);
    }
  });

  return container;
};

export default createContainer;
