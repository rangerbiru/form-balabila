// import React from 'react'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormInput from "./FormInput";
import Tes from "./Tes";

const App = () => {
  return (
    <>
      <BrowserRouter basename="/form-balabila/">
        <Routes>
          <Route path="/" element={<FormInput />} />
          <Route path="/tes" element={<Tes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
