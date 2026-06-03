// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'blog-api',
    script: './server.js',
    
    // Clustering
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    
    // Environment variables
    env: {
      NODE_ENV: 'development',
      PORT: 3009
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3009
    },
    
    // Auto restart
    watch: false,
    max_memory_restart: '500M',
    
    // Logging
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true,
    
    // Graceful shutdown
    kill_timeout: 5000
  }]
};
