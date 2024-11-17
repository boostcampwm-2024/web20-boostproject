export default () => ({
  apiServer: {
    url: process.env.API_SERVER_URL,
    timeout: parseInt(process.env.HTTP_TIMEOUT, 10) || 5000,
  },
});
