export const transportConfig = {
  plainRtpTransport: {
    listenIp: { ip: '0.0.0.0', announcedIp: '127.0.0.1' },
    rtcpMux: true,
    comedia: false,
  },
  webRtcTransport: {
    listenInfos: [
      {
        protocol: 'udp',
        ip: '0.0.0.0',
        announcedAddress: '127.0.0.1',
        portRange: { min: 30000, max: 30100 },
      },
      {
        protocol: 'tcp',
        ip: '0.0.0.0',
        announcedAddress: '127.0.0.1',
        portRange: { min: 30000, max: 30100 },
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  },
};
