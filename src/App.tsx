import { Route, Routes } from 'react-router';
import { Home } from './routes/Home';
import { Specimen } from './routes/Specimen';
import { PolicyPlaceholder } from './routes/PolicyPlaceholder';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/en" element={<Home />} />
      <Route path="/en/" element={<Home />} />
      <Route path="/specimen" element={<Specimen />} />

      {/* Legal routes (populated in Phase 5) */}
      <Route path="/privacy" element={<PolicyPlaceholder title="Privacy Policy" />} />
      <Route path="/cookie" element={<PolicyPlaceholder title="Cookie Policy" />} />
      <Route path="/note-legali" element={<PolicyPlaceholder title="Note Legali" />} />
      <Route path="/en/privacy" element={<PolicyPlaceholder title="Privacy Policy" />} />
      <Route path="/en/cookie" element={<PolicyPlaceholder title="Cookie Policy" />} />
      <Route path="/en/legal-notice" element={<PolicyPlaceholder title="Legal Notice" />} />

      {/* Future location template route */}
      <Route path="/localita/:slug" element={<Home />} />
      <Route path="/en/locations/:slug" element={<Home />} />
    </Routes>
  );
}