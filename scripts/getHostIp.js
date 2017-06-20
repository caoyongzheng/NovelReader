const os = require('os');

module.exports = () => {
  const ifaces = os.networkInterfaces();

  let ip;

  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      ip = iface.address;
    });
  });

  return ip;
};
