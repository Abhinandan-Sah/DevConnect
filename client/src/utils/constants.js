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

// export const BASE_URL = (() => {
//   const hostname = window.location.hostname;
//   const AZURE_API = 'http://20.40.54.228:5000';
//   const RENDER_API = 'https://devconnect-ttjp.onrender.com';

//   // Development or Production check
//   if (hostname === 'localhost') {
//     return 'http://localhost:5000';
//   }

//   // For both domain and direct IP access
//   if (hostname === 'devconnects.tech' || 
//       hostname === 'www.devconnects.tech' || 
//       hostname === '20.40.54.228') {
//     return AZURE_API;
//   }

//    if (hostname === 'devconnect-ttjp.onrender.com') {
//     return RENDER_API;
//    }

//   return '/api'; // Fallback
// })();

export const BASE_URL = (() => {
  const hostname = window.location.hostname;
  const RENDER_API = 'https://devconnect-ttjp.onrender.com/api';
  const AZURE_API = 'http://20.244.50.103/api';
  const DEVCONNECTS_API = 'https://devconnects.tech/api';

  // Development or Production check
  if (hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  // For both domain and direct IP access
  if (
    hostname === 'devconnects.tech' ||
    hostname === 'www.devconnects.tech'
  ) {
    return DEVCONNECTS_API;
  }

  if (hostname === 'devconnect-ttjp.onrender.com') {
    return RENDER_API;
  }

  // For new API IP
  if (hostname === '20.244.50.103') {
    return AZURE_API;
  }

  return '/api'; // Fallback
  })();