// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventMap from './components/EventMap';
import Auth from './Auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventMap />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}