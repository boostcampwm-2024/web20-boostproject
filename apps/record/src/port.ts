const MIN_PORT = 10000;
const MAX_PORT = 10300;

const takenPort = new Set();

export const getPort = () => {
  let port = getRandomPort();
  while (takenPort.has(port)) {
    port = getRandomPort();
  }
  takenPort.add(port).add(port + 1);
  return port;
};

export const releasePort = (port: number) => {
  takenPort.delete(port);
  takenPort.delete(port + 1);
};

const getRandomPort = () => {
  const port = Math.floor(Math.random() * (MAX_PORT - MIN_PORT + 1) + MIN_PORT);
  return port % 2 === 0 ? port : port + 1;
};
