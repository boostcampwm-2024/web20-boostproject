const MIN_PORT = 10000;
const MAX_PORT = 10200;

const takenPort = new Set();

export const getPort = () => {
  let port = getRandomPort();
  while (takenPort.has(port)) {
    port = getRandomPort();
  }
  takenPort.add(port);
  return port;
};

export const releasePort = (port: number) => {
  takenPort.delete(port);
};

const getRandomPort = () => {
  const port = Math.floor(Math.random() * (MAX_PORT - MIN_PORT + 1) + MIN_PORT);
  return port % 2 === 0 ? port : port + 1;
};
