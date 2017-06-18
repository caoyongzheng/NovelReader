function event(name, tag = 'div') {
  let el = document.createElement(tag);
  const eventName = `on${name}`;
  let isSupported = (eventName in el);
  if (!isSupported) {
    el.setAttribute(eventName, 'return;');
    isSupported = typeof el[eventName] === 'function';
  }
  el = null;
  return isSupported;
}

export default {
  event,
};
