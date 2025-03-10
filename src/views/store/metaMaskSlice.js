import wsLocalStorage from '../handlers/wsLocalStorage';
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  isEthereumConnected: false,
  isEthereumChecked: false,
  isHasLoggedOutLoaded: false,
  hasLoggedOut: 0,
}

export const metaMaskSlice = createSlice({
  name: 'metaMask',
  initialState,
  reducers: {
    metaMaskLogin: (state) => {
        if(wsLocalStorage.hasLoggedOut()) {
            wsLocalStorage.setLogin();
            state.hasLoggedOut = 0;
            state.isEthereumConnected = true;
            state.isHasLoggedOutLoaded = true;
        }
    },
    metaMaskLogout: (state) => {
        if(!wsLocalStorage.hasLoggedOut()) {
            wsLocalStorage.setLogout();
            state.hasLoggedOut = 1;
            state.isEthereumConnected = false;
            state.isHasLoggedOutLoaded = true;
        }
    },
    setHasLoggedOut: (state, action) => {
        state.hasLoggedOut = action.payload;
        state.isHasLoggedOutLoaded = true;
    },
    setIsEthereumConnected: (state, action) => {
      state.isEthereumConnected = action.payload;
    },
    setIsEthereumChecked: (state) => {
      state.isEthereumChecked = true;
    },
  },
})


export const { metaMaskLogin, metaMaskLogout, setHasLoggedOut, setIsEthereumConnected, setIsEthereumChecked } = metaMaskSlice.actions

export default metaMaskSlice.reducer
