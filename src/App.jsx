// import React from 'react'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormInput from "./FormInput";
import Tes from "./Tes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/form-balabila" element={<FormInput />} />
          <Route path="/tes" element={<Tes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
