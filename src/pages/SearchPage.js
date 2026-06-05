import { SearchIcon, ArrowLeft, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// SearchResultsPage.jsx
const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(query);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
            setSearchInput(query);
        }
    }, [query]);

    const fetchSearchResults = async (searchQuery) => {
        setLoading(true);
        try {
            // Replace with your actual search API endpoint
            const response = await fetch(`https://brublabackend.onrender.com/api/users/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setResults(data.data || []);
            
            // Fetch suggestions based on search query
            if (searchQuery.length > 0) {
                fetchSuggestions(searchQuery);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async (searchQuery) => {
        try {
            // Replace with your suggestions API endpoint
            const response = await fetch(`https://brublabackend.onrender.com/api/users/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSuggestions(data.data || []);
        } catch (error) {
            console.error('Suggestions error:', error);
            setSuggestions([]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput.trim() });
            setShowSuggestions(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        if (value.length > 0) {
            fetchSuggestions(value);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchInput(suggestion);
        setSearchParams({ q: suggestion });
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        setSearchInput('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    // Popular searches / trending
    const popularSearches = [
        "Jeans", "Jackets", "T-Shirts", "Winter Collection", 
        "Premium", "Summer", "Casual", "Formal"
    ];

    return (
        <div className="min-h-screen bg-[#f9f5f0]">
            {/* Search Bar Header */}
            <div className="sticky top-0 z-50 bg-[#f9f5f0] border-b border-[rgba(111,78,55,0.1)] pt-20 pb-4 px-4 md:px-8 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-shrink-0 p-2 rounded-full transition-colors hover:bg-[#ece5de]"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5 text-[#1f1f1f]" />
                            </button>
                            <div className="flex-1 relative">
                                <div className="flex items-center gap-2.5 rounded-full px-4 py-2.5 bg-white border border-[rgba(111,78,55,0.2)] focus-within:border-black focus-within:shadow-lg transition-all">
                                    <SearchIcon className="w-4 h-4 flex-shrink-0 text-[#7a6a5a]" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={searchInput}
                                        onChange={handleInputChange}
                                        onFocus={() => searchInput.length > 0 && setShowSuggestions(true)}
                                        placeholder="Search products, brands, categories..."
                                        className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:text-[#7a6a5a]"
                                        style={{ color: "#000", caretColor: "#000" }}
                                    />
                                    {searchInput && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="flex-shrink-0 p-1 rounded-full hover:bg-[#f9f5f0] transition-colors"
                                        >
                                            <X className="w-4 h-4 text-[#7a6a5a]" />
                                        </button>
                                    )}
                                </div>
                                
                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[rgba(111,78,55,0.1)] overflow-hidden z-50">
                                        <div className="py-2">
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#f9f5f0] transition-colors text-left"
                                                >
                                                    <SearchIcon className="w-4 h-4 text-[#7a6a5a]" />
                                                    <span className="text-sm text-[#1f1f1f]">{suggestion}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-[#333] transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="px-4 md:px-8 lg:px-12 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Popular Searches (when no query) */}
                    {!query && (
                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-[#1f1f1f] mb-3">Popular Searches</h2>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => {
                                            setSearchInput(term);
                                            setSearchParams({ q: term });
                                        }}
                                        className="px-4 py-2 rounded-full text-sm bg-white border border-[rgba(111,78,55,0.15)] text-[#1f1f1f] hover:bg-[#ece5de] transition-all hover:scale-105"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    {query && (
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#1f1f1f]">
                                Search Results
                            </h1>
                            <p className="text-[#7a6a5a] mt-2">
                                {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
                            </p>
                        </div>
                    )}

                    {/* Results Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-lg h-64 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                {results.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="cursor-pointer group"
                                    >
                                        <div className="overflow-hidden rounded-lg mb-3 bg-white">
                                            <img
                                                src={product.mainImage}
                                                alt={product.name}
                                                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <h3 className="font-semibold text-[#1f1f1f] mb-1 line-clamp-2">{product.name}</h3>
                                        <p className="text-[#7a6a5a] text-sm">
                                            ${product.displayPrice}
                                            {product.originalPrice > product.displayPrice && (
                                                <span className="line-through ml-2 text-xs text-[#aaa]">
                                                    ${product.originalPrice}
                                                </span>
                                            )}
                                        </p>
                                        {product.discount > 0 && (
                                            <span className="inline-block mt-1 text-xs font-semibold text-green-600">
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Load More Button (if applicable) */}
                            {results.length >= 20 && (
                                <div className="text-center mt-12">
                                    <button className="px-8 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-[#333] transition-colors">
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    ) : query ? (
                        <div className="text-center py-20">
                            <SearchIcon className="w-16 h-16 mx-auto opacity-20 mb-4" />
                            <h2 className="text-xl font-semibold text-[#1f1f1f] mb-2">
                                No results found
                            </h2>
                            <p className="text-[#7a6a5a] max-w-md mx-auto">
                                We couldn't find any products matching "{query}". 
                                Try checking your spelling or using different keywords.
                            </p>
                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-[#1f1f1f] mb-3">Try these popular searches:</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {popularSearches.slice(0, 4).map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                setSearchInput(term);
                                                setSearchParams({ q: term });
                                            }}
                                            className="px-4 py-2 rounded-full text-sm bg-white border border-[rgba(111,78,55,0.15)] text-[#1f1f1f] hover:bg-[#ece5de] transition-all"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/products')}
                                className="mt-8 px-6 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-[#333] transition"
                            >
                                Browse All Products
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;