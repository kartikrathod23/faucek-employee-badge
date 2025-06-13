import { useState } from 'react'
import MultiStepForm from './pages/MultiStepForm'
import ThankYouPage from './pages/ThankYouPage'
// import SubmissionsList from './pages/SubmissionsList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<MultiStepForm />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          {/* <Route path="/submissions" element={<SubmissionsList />} /> */}
        </Routes>
    </Router>)
}

export default App
