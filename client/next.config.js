module.exports = {
  webpack: (config) => {
    // for the quik change
    config.watchOptions.poll = 300; // 300 milisecond
    return config;
  },
};
