import React, { createContext, useReducer, useContext } from 'react';
const AppContext = createContext();

const initialState = {
    count: 0,
  };

const myReducer = ({state, action}) =>{
    switch (action.type){
        case 'increment' : 
            return { ...state, count: state.count + 1};
        case 'decrement' :
            return {...state, count:state.count - 1};
        default: return state;
    }
}
const myProvider = ({children}) => {
    const [state, dispatch] = useReducer(myReducer, initialState);
    return {
        <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
    }
}