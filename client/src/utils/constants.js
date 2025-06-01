// For Development
// export const BASE_URL = "http://localhost:5000";

// For Production
// export const BASE_URL = "/api"

// Takes dynamic hostname
// export const BASE_URL = location.hostname === "localhost" ? "http://localhost:5000": "/api";
// export const BASE_URL = location.hostname === "20.40.54.228" ? "http://20.40.54.228:5000": "/api";

// export const BASE_URL =
//   location.hostname === "devconnects.tech" ||
//   location.hostname === "www.devconnects.tech" ||
//   location.hostname === "localhost" ||
//   location.hostname === "20.40.54.228"
//     ? "http://20.40.54.228:5000"
//     : "/api";

export const BASE_URL = (() => {
  const hostname = window.location.hostname;
  const AZURE_API = 'http://20.40.54.228:5000';

  // Development or Production check
  if (hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  // For both domain and direct IP access
  if (hostname === 'devconnects.tech' || 
      hostname === 'www.devconnects.tech' || 
      hostname === '20.40.54.228') {
    return AZURE_API;
  }

  return '/api'; // Fallback
})();