import * as api from './api';
import debounce from '../utils/debounce';
import checkInner from '../utils/checkInner';
// import createElement from '../utils/createElement';

import defaultUserInfo from '../default/userinfo.simple.json';
import defaultUserSign from '../default/usersign.view.json';
import defaultTrackerData from '../default/usertracker.json';

const drawAvatar = (con) => {
  const holder = document.createElement('section');
  holder.classList.add('userinfo-sticky-avatar');
  con.appendChild(holder);

  const img = document.createElement('img');
  img.src = '';
  holder.appendChild(img);

  return avatar => (img.src = avatar);
};

const drawDefaultPanel = (con) => {
  const holder = document.createElement('section');
  holder.classList.add('userinfo-sticky-default-panel');
  con.appendChild(holder);

  const line1 = document.createElement('div');
  line1.classList.add('userinfo-sticky-line');
  const msgBtn = document.createElement('a');
  msgBtn.classList.add('userinfo-sticky', 'userinfo-sticky-msg');
  msgBtn.type = 'button';
  msgBtn.href = '/messages.php';
  msgBtn.title = '点击查看';
  line1.appendChild(msgBtn);

  const line2 = document.createElement('div');
  line2.classList.add('userinfo-sticky-line');
  const signBtn = document.createElement('a');
  signBtn.classList.add('userinfo-sticky', 'userinfo-sticky-sign');
  signBtn.type = 'button';
  signBtn.href = '/take_signin_bonus.php?total_days=1';
  signBtn.title = '点击签到';
  line2.appendChild(signBtn);

  holder.appendChild(line1);
  holder.appendChild(line2);

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
        signBtn.appendChild(document.createTextNode('签到'));
      }
    },
  ];
};

const drawDatails = (con) => {
  const holder = document.createElement('section');
  holder.classList.add('userinfo-sticky-details-panel', 'hide');
  con.appendChild(holder);

  const lines = [];

  const line1 = document.createElement('div');
  line1.classList.add('userinfo-sticky-line');
  const usernameLink = document.createElement('a');
  usernameLink.classList.add('username-link'); // not compatible old style
  usernameLink.target = '_blank';
  line1.appendChild(usernameLink);
  lines.push(line1);

  const line2 = document.createElement('div');
  line2.classList.add('userinfo-sticky-line');
  const upSpan = document.createElement('span');
  upSpan.appendChild(document.createTextNode('流量贡献度: '));
  line2.appendChild(upSpan);
  lines.push(line2);

  const line3 = document.createElement('div');
  line3.classList.add('userinfo-sticky-line');
  const timeSpan = document.createElement('span');
  timeSpan.appendChild(document.createTextNode('时间贡献度: '));
  line3.appendChild(timeSpan);
  lines.push(line3);

  const line4 = document.createElement('div');
  line4.classList.add('userinfo-sticky-line');
  const hpSpan = document.createElement('span');
  hpSpan.appendChild(document.createTextNode('HP: '));
  line4.appendChild(hpSpan);
  lines.push(line4);

  const line5 = document.createElement('div');
  line5.classList.add('userinfo-sticky-line');
  const seedSpan = document.createElement('span');
  seedSpan.appendChild(document.createTextNode('做种数: '));
  line5.appendChild(seedSpan);
  lines.push(line5);

  const line6 = document.createElement('div');
  line6.classList.add('userinfo-sticky-line');
  const leechSpan = document.createElement('span');
  leechSpan.appendChild(document.createTextNode('下载数: '));
  line6.appendChild(leechSpan);
  lines.push(line6);

  const line7 = document.createElement('div');
  line7.classList.add('userinfo-sticky-line');
  const clearButtonLink = document.createElement('a');
  clearButtonLink.classList.add('userinfo-sticky', 'userinfo-sticky-cleartracker-link');
  clearButtonLink.type = 'button';
  clearButtonLink.title = '清理冗余种子';
  clearButtonLink.href = '/tracker/info.php?info=tracker&type=clean';
  clearButtonLink.target = '_blank';
  clearButtonLink.appendChild(document.createTextNode('清理冗余种子'));
  line7.appendChild(clearButtonLink);
  lines.push(line7);

  const line8 = document.createElement('div');
  line8.classList.add('userinfo-sticky-line');
  const exchangeBonusLink = document.createElement('a');
  exchangeBonusLink.classList.add('userinfo-sticky', 'userinfo-sticky-exchange-link');
  exchangeBonusLink.type = 'button';
  exchangeBonusLink.title = '兑换100魔力';
  exchangeBonusLink.href = '/tracker/bonus.php?method=exchange&n=100';
  exchangeBonusLink.target = '_blank';
  exchangeBonusLink.appendChild(document.createTextNode('兑换100魔力'));
  line8.appendChild(exchangeBonusLink);
  lines.push(line8);

  const line9 = document.createElement('div');
  line9.classList.add('userinfo-sticky-line');
  const exchangeHPLink = document.createElement('a');
  exchangeHPLink.classList.add('userinfo-sticky', 'userinfo-sticky-exchange-link');
  exchangeHPLink.type = 'button';
  exchangeHPLink.title = '兑换100HP';
  exchangeHPLink.href = '/tracker/bonus.php?method=exchange&n=100&heal=hp';
  exchangeHPLink.target = '_blank';
  exchangeHPLink.appendChild(document.createTextNode('兑换100HP'));
  line9.appendChild(exchangeHPLink);
  lines.push(line9);

  lines.forEach((line) => {
    holder.appendChild(line);
  });

  return ({ info, tracker }) => {
    usernameLink.classList.add(`UC_${info.class}`);
    usernameLink.appendChild(document.createTextNode(info.username));
    upSpan.appendChild(document.createTextNode((+tracker.up).toLocaleString()));
    timeSpan.appendChild(document.createTextNode((+tracker.time / 86400).toLocaleString()));
    hpSpan.appendChild(document.createTextNode((+tracker.hp).toLocaleString()));
    seedSpan.appendChild(document.createTextNode((+tracker.seed).toLocaleString()));
    leechSpan.appendChild(document.createTextNode((+tracker.leech).toLocaleString()));
  };
};

const drawControls = (con) => {
  const holder = document.createElement('section');
  holder.classList.add('userinfo-sticky-controls-panel', 'hide');
  con.appendChild(holder);

  const line1 = document.createElement('div');
  line1.classList.add('userinfo-sticky-line');
  const controlLinkButton = document.createElement('a');
  controlLinkButton.classList.add('userinfo-sticky', 'userinfo-sticky-control-link');
  controlLinkButton.type = 'button';
  controlLinkButton.title = '进入控制面板';
  controlLinkButton.href = '/usercp.php?action=personal';
  controlLinkButton.target = '_blank';
  controlLinkButton.appendChild(document.createTextNode('控制面板'));
  line1.appendChild(controlLinkButton);

  const line2 = document.createElement('div');
  line2.classList.add('userinfo-sticky-line');
  const detailsLinkButton = document.createElement('a');
  detailsLinkButton.classList.add('userinfo-sticky', 'userinfo-sticky-details-link');
  detailsLinkButton.type = 'button';
  detailsLinkButton.title = '查看个人信息';
  detailsLinkButton.href = '/userdetails.php';
  detailsLinkButton.target = '_blank';
  detailsLinkButton.appendChild(document.createTextNode('个人信息'));
  line2.appendChild(detailsLinkButton);

  const line3 = document.createElement('div');
  line3.classList.add('userinfo-sticky-line');
  const rssLinkButon = document.createElement('a');
  rssLinkButon.classList.add('userinfo-sticky', 'userinfo-sticky-rss-link');
  rssLinkButon.type = 'button';
  rssLinkButon.title = '订阅';
  rssLinkButon.href = '/getrss.php';
  rssLinkButon.target = '_blank';
  rssLinkButon.appendChild(document.createTextNode('订阅'));
  line3.appendChild(rssLinkButon);

  const line4 = document.createElement('div');
  line4.classList.add('userinfo-sticky-line');
  const bookmarkLinkButton = document.createElement('a');
  bookmarkLinkButton.classList.add('userinfo-sticky', 'userinfo-sticky-rss-link');
  bookmarkLinkButton.type = 'button';
  bookmarkLinkButton.title = '收藏';
  bookmarkLinkButton.href = '/torrents.php?inclbookmarked=1&allsec=1&incldead=0';
  bookmarkLinkButton.target = '_blank';
  bookmarkLinkButton.appendChild(document.createTextNode('收藏'));
  line4.appendChild(bookmarkLinkButton);

  const line5 = document.createElement('div');
  line5.classList.add('userinfo-sticky-line');
  const bonusLinkButton = document.createElement('a');
  bonusLinkButton.classList.add('userinfo-sticky', 'userinfo-sticky-rss-link');
  bonusLinkButton.type = 'button';
  bonusLinkButton.title = '使用魔力';
  bonusLinkButton.href = '/mybonus.php';
  bonusLinkButton.target = '_blank';
  bonusLinkButton.appendChild(document.createTextNode('使用魔力'));
  line5.appendChild(bonusLinkButton);

  holder.appendChild(line1);
  holder.appendChild(line2);
  holder.appendChild(line3);
  holder.appendChild(line4);
  holder.appendChild(line5);
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

  window.addEventListener('scroll', debounce(() => {
    const nMainRect = main.getBoundingClientRect();
    const nBodyRect = body.getBoundingClientRect();

    container.style.top = `${((nMainRect.top < 20) ? 20 : nMainRect.top) - nBodyRect.top}px`;
  }, 250));

  const fillAvatar = drawAvatar(container);
  const [fillMsg, fillSignDays] = drawDefaultPanel(container);
  drawControls(container);
  const fillDetails = drawDatails(container);

  // ajax request
  const user = {
    info: defaultUserInfo,
    unread: 0,
    sign: defaultUserSign,
  };

  api.getBasicInfo((err, data) => {
    if (!err && data) user.info = data;
    fillAvatar(user.info.avatar);
  });

  api.getUnread((err, data) => {
    if (!err && data) user.unread = data;
    fillMsg(user.unread);
  });

  api.getSignInfo((err, data) => {
    if (!err && data) user.sign = data;
    fillSignDays(user.sign.l === '0' ? +user.sign.t : 0);
  });

  // // bind 'mouseenter' and 'click' events
  // let toggleTrackerDetails = false;
  // const mouseenterHandle = (ev) => {
  //   if (toggleTrackerDetails) return;
  //   const globalMouseoverHandle = (ev) => {
  //   };
  //   document.body.addEventListener('mouseover', globalMouseoverHandle);
  // };
  // container.addEventListener('mouseenter', mouseenterHandle);

  const avatarHolder = container.querySelector('.userinfo-sticky-avatar');
  const controlsPanel = container.querySelector('.userinfo-sticky-controls-panel');
  const detailsPanel = container.querySelector('.userinfo-sticky-details-panel');

  let swFetchTarckerData = false;

  if (avatarHolder && controlsPanel) {
    // rempve details show
    const clickAvatarOuterHandle = (ev) => {
      if (!checkInner(ev.target, container)) {
        container.classList.remove('bgcolor');
        controlsPanel.classList.add('hide');
        detailsPanel.classList.add('hide');
        document.body.removeEventListener('click', clickAvatarOuterHandle);
      }
    };
    // show details panel
    const clickAvatarHandle = () => {
      if (!swFetchTarckerData) {
        api.getTrackerInfo((err, data) => {
          const tracker = (!err && data) ? data : defaultTrackerData;
          user.tracker = tracker;
          swFetchTarckerData = true;
          fillDetails(user);
        });
      }
      container.classList.add('bgcolor');
      controlsPanel.classList.remove('hide');
      detailsPanel.classList.remove('hide');
      // remove details panel
      document.body.addEventListener('click', clickAvatarOuterHandle);
    };
    // TODO: ensure it
    avatarHolder.addEventListener('click', clickAvatarHandle);
  }

  return container;
};

export default createContainer;
