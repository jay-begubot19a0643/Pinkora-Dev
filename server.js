const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Supabase
const supabase = require('./api/config-supabase');

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these in your .env file or Vercel environment variables.');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Supabase Connection
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
  } catch (err) {
    console.error('⚠️  Supabase connection error:', err.message);
    console.log('📌 Server will start but database operations may fail');
    console.log('💡 Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set correctly');
  }
})();

// Routes
app.use('/api/auth', require('./api/routes/auth-supabase'));
app.use('/api', require('./api/routes/feedback-supabase'));
app.use('/api', require('./api/routes/contact-supabase'));
app.use('/api', require('./api/routes/recommendations-supabase'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/mainpage.html');
});

// Static files (serve frontend)
app.use(express.static(__dirname));

// Serve HTML files for any .html request
app.get('/:file.html', (req, res) => {
  res.sendFile(__dirname + '/' + req.params.file + '.html');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
