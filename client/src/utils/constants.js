// For Development
// export const BASE_URL = "http://localhost:5000";

// For Production
// export const BASE_URL = "/api"

// Takes dynamic hostname
// export const BASE_URL = location.hostname === "localhost" ? "http://localhost:5000": "/api";
// export const BASE_URL = location.hostname === "20.40.54.228" ? "http://20.40.54.228:5000": "/api";

export const BASE_URL =
  location.hostname === "devconnects.tech" ||
  location.hostname === "www.devconnects.tech" ||
  location.hostname === "localhost" ||
  location.hostname === "20.40.54.228"
    ? "http://20.40.54.228:5000"
    : "/api";
