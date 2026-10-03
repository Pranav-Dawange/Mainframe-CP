import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search as SearchIcon, FileText, AlertTriangle, ExternalLink } from 'lucide-react';
import { searchApi } from '../api/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [location.search]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const res = await searchApi.search(searchQuery);
      setResults(res.data || []);
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto text-center pt-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Global Search</h1>
        <form onSubmit={handleSearch} className="relative flex items-center">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all documents, tags, content..."
            className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent shadow-sm"
          />
          <button 
            type="submit" 
            className="absolute right-2 btn-primary px-6 py-2 rounded-lg"
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Searching...</div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        ) : hasSearched ? (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4 border-b border-gray-200 pb-2">
              {results.length} result{results.length !== 1 ? 's' : ''} found for "{query}"
            </h2>
            
            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 border-dashed">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search terms or keywords.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 text-blue-500 rounded-lg shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary mb-1">{result.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Type:</span> {result.type || 'Document'} &bull; 
                          <span className="font-medium ml-2">Date:</span> {new Date(result.created_at || result.date || Date.now()).toLocaleDateString()}
                        </p>
                        {result.snippet && (
                          <p className="text-sm text-gray-600 line-clamp-2 italic border-l-2 border-gray-300 pl-3">
                            "{result.snippet}"
                          </p>
                        )}
                      </div>
                    </div>
                    <Link to={`/documents/${result.document_id || result.id}`} className="btn-secondary flex items-center gap-2 shrink-0">
                      Open <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Enter a query above to start searching your vault.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
