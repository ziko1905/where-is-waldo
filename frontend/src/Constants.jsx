const prod = {
  url: {
    BASE_URL: import.meta.env.VITE_BACKEND_PROD_URL,
  },
};

const dev = {
  url: {
    BASE_URL: import.meta.env.VITE_BACKEND_DEV_URL,
  },
};

export const config = import.meta.env.MODE == "production" ? prod : dev;
