import { configureStore } from '@reduxjs/toolkit'
import shipmentReducer from '../features/shipments/ShipmentSlice'
export default configureStore({
  reducer: {
    shipments:shipmentReducer
  }
})

