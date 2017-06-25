const deepRemoveChild = (element) => {
  if (element.childNodes) {
    [...element.childNodes].forEach(deepRemoveChild);
  }

  if (element.remove) element.remove();
  else element.parentNode.removeChild(element);
};

const grow = (element, children) => {
  if (children instanceof String) {
    grow(element, document.createTextNode(element));
  } else if (!Array.isArray(children)) {
    grow(element, [children]);
  } else {
    children.forEach(el => element.appendChild(el));
  }
};

const createElement = (tag, props = {}, children) => {
  const element = document.createElement(tag);
  const events = [];
  Object.keys(props).forEach((name) => {
    if (name.startsWith('on')) {
      const eventname = name.substring(2).toLocaleLowerCase();
      events.push([eventname, props[name]]);
    } else if (name === 'data') {
      if (props.data instanceof Object) {
        Object.keys(props.data).forEach((key) => {
          element.dataset[key] = props.data[key];
        });
      }
    } else if (name === 'classList') {
      if (Array.isArray(props.classList)) {
        element.classList.add(...props.classList);
      }
    } else {
      element[name] = props[name];
    }
  });

  if (events.length) {
    events.forEach(([eventname, handle]) => {
      element.addEventListener(eventname, handle);
    });
  }

  if (children) grow(element, children);

  // overwrite 'ChildNode.remove()' method
  const oldremove = element.remove;
  element.remove = (() => {
    if (events.length) {
      events.forEach(([eventname, handle]) => {
        element.removeEventListener(eventname, handle);
      });
    }

    if (element.childNodes) {
      [...element.childNodes].forEach(deepRemoveChild);
    }

    if (oldremove) oldremove.bind(element)();
    else element.parentNode.removeChild(element);
  });

  return element;
};

export default createElement;
