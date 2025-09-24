const mongoose=require('mongoose')

const RouteSchema=new mongoose.Schema({

    location:{
                type:String,
                require:true
            },
    coordinates:{
                lat:{type:Number},
                lng:{type:Number}
            },
    timestamp:{
                type:Date ,
                default:Date.now
            }

},{_id:false})


const ShipmentSchema=new mongoose.Schema({
    shipmentId:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    containerId:{
        type:String,
        required:true,
        trim:true
    },
    origin: {
      type: String,
      required: true,
    },
    originCoordinates: {
  lat: Number,
  lng: Number
},

    destination: {
      type: String,
      required: true,
    },
    destinationCoordinates: {
    lat: Number,
    lng: Number
  },
    routes:[RouteSchema ],

   
    eta:{
        type:Date
    },
    status:{
        type:String,
        enum:["Pending","In Transit","Delayed","Delivered","Cancelled"],
        default:"Pending"
    },

},
{timestamps:true}

)

module.exports=mongoose.model('shipments',ShipmentSchema)