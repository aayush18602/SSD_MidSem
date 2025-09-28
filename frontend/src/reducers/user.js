import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: null,
  email: null,
  role: null,
  token: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state._id = action.payload._id
      state.email = action.payload.email
      state.role = action.payload.role
      state.token = action.payload.token
    },
    resetUserDetails: (state) => {
      state._id = null
      state.email = null
      state.role = null
      state.token = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserDetails, resetUserDetails } = userSlice.actions

export default userSlice.reducer