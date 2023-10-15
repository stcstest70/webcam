import Navbar from './components/navbar/navbar';
import { Routes, Route } from "react-router-dom";
import Login from './components/login/login';
import HomePage from './components/homePage/homePage';
import { createContext, useReducer } from 'react';
import { initialState, reducer } from './components/UserReducer';

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  if ("UserToken" in sessionStorage) {
    //Do nothing
  } else {
    sessionStorage.setItem("UserToken", JSON.stringify([]));
  }
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
