const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const shipmentRoutes = require('./routes/shipmentRoutes')
const authRoutes = require('./routes/authRoutes')
const logger = require('./src/utils/logger')

const { PORT } = require('./src/config/config')

const connectDB = require('./src/config/database')

connectDB()

const app = express()
app.use(cors())

dotenv.config()

app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api', shipmentRoutes)
app.use('/api', require('./routes/containerRoutes'))

app.get('/test', (req, res) => res.send("testing completed"))

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);

  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    console.log('✅ SMTP Configuration: Loaded');
  } else {
    console.log('⚠️  SMTP Configuration: MISSING (Emails will be mocked)');
  }
});