import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SavedProvider } from './context/SavedProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { EventDetailSkeleton } from './components/Skeletons';

import { AmbientBackground } from './components/AmbientBackground';

// Code-split detail and not found pages
const EventDetail = lazy(() =>
  import('./pages/EventDetail').then((module) => ({ default: module.EventDetail }))
);
const NotFound = lazy(() =>
  import('./pages/NotFound').then((module) => ({ default: module.NotFound }))
);

export function App() {
  return (
    <ErrorBoundary>
      <SavedProvider>
        <BrowserRouter>
          <div className="app-shell">
            <AmbientBackground />
            <Navbar />
            <div className="app-main-view">
              <Suspense fallback={<EventDetailSkeleton />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </SavedProvider>
    </ErrorBoundary>
  );
}

export default App;
