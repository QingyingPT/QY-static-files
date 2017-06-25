const checkInner = (target, container) => {
  if (target === document.body) return false;
  else if (target === container) return true;
  return checkInner(target.parentNode, container);
};

export default checkInner;
