import React from 'react';
import { createRoot } from 'react-dom/client';
import './reset.css';
import './global.css';
import Layout from './layout';
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import { UserProvider } from './context/userContext';
import { ChakraProvider } from '@chakra-ui/react';
import GiftDetailPage from './components/GiftDetailPage';
import GiftDisplayPage from './components/GiftDisplayPage';

const container =
  document.getElementById('app') || document.createElement('div');
container.id = 'app';
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/:type" element={<AuthPage />} />
              <Route path="/gifts" element={<GiftDisplayPage />} />
              <Route path="/gifts/:id" element={<GiftDetailPage />} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
);
