import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    dir: 't',
  },
});

export const getDir = (state) => console.log('getDir', state);
export const setDir = (state, dir) => console.log('setDir', state, dir);

export default configSlice.reducer;
