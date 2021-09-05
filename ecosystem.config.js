module.exports = {
  apps: [
    {
      name: "Backend",
      script: "./server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        TZ: "America/New_York",
      },
    },
  ],
};
