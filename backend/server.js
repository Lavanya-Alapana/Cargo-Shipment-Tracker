const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const shipmentRoutes=require('./routes/shipmentRoutes')
const logger=require('./src/utils/logger')

const {PORT}=require('./src/config/config')

const connectDB=require('./src/config/database')

connectDB()

const app=express()
app.use(cors())

dotenv.config()

app.use(express.json());

app.use('/api',shipmentRoutes)

app.get('/test',(req,res)=> res.send("testing completed"))

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});