module.exports = {
  apps: [
    {
      name: "workiffy",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "700M",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
