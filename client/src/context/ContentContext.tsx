import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react'; // <-- Добавлено type

type Content = any;
type Ctx = {
  content: Content | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

const ContentContext = createContext<Ctx>({
  content: null, loading: true, error: null, reload: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/content')
      .then(r => (r.ok ? r.json() : Promise.reject('HTTP ' + r.status)))
      .then(data => { setContent(data); setError(null); })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, reload: load }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);