// import React from 'react'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormInput from "./FormInput";

const App = () => {
  return (
    <>
      <BrowserRouter basename="/form-bikers/">
        <Routes>
          <Route path="/" element={<FormInput />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
