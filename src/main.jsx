import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"

import "./index.css";
import App from './App.jsx'
import Reviews from './Reviews.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx';
import NavBar from './NavBar.jsx';

function AppLayout() {
  return (
    <div className="bg-[#020d10]">
      <NavBar />
      <div className="-mt-[72px] pt-[72px] md:-mt-[88px] md:pt-[88px]">
        <Outlet />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>

      <Analytics />
      
    </BrowserRouter>
  </StrictMode>,
)
