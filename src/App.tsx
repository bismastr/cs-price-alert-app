import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ItemDetailPage } from './pages/ItemDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:itemId" element={<ItemDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
