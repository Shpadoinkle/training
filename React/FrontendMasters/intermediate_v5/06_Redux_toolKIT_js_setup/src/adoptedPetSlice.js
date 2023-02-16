import { createSlice } from "@reduxjs/toolkit";

export const adoptedPetSlice = createSlice({
  name: "adoptedPet",
  initialState: {
    value: null,
  },
  reducers: {
    adopt: (state, action) => {
      state.value = action.payload;
    },
    unadopt: (state, action) => {
      state.value = null;
    },
  },
});

export const { adopt, unadopt } = adoptedPetSlice.actions;
export default adoptedPetSlice.reducer;
