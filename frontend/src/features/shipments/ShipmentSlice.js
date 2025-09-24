import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'

import { createShipment, fetchETA, fetchShipments } from '../../api/shipmentApi'

export const getShipments=createAsyncThunk('shipments/getAll',async()=>{
    return await fetchShipments()
})

export const addShipment=createAsyncThunk('shipment/add',async(shipment)=>{
    return await createShipment(shipment)

})


export const getETA=createAsyncThunk('/shipment/eta',async(id)=>{
    return await fetchETA(id)
})

const shipmentSlice=createSlice({
    name:"shipments",
    initialState:{
        items:[],
        loading:false,
        error:null,
        eta:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder

        .addCase(getShipments.pending,(state)=>{
            state.loading=true,
             state.error=null
        })

        .addCase(getShipments.fulfilled,(state,action)=>{
            state.loading=false,
            state.items=action.payload.shipments
        })

        .addCase(getShipments.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.error.message
        })


        .addCase(addShipment.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(addShipment.fulfilled,(state,action)=>{
            state.loading=false,
            state.items.push(action.payload)
        })

        .addCase(addShipment.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.error.message
        })


         .addCase(getETA.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(getETA.fulfilled,(state,action)=>{
            state.loading=false,
            state.eta=action.payload
        })

        .addCase(getETA.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.error.message
        })
    }
})

export default shipmentSlice.reducer