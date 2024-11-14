// import * as mediasoupClient from 'mediasoup-client';
// import { useEffect, useRef, useState } from 'react';
// import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
// import { Transport, Device } from 'mediasoup-client/lib/types';
// import {
//   RtpCapabilitiesResponse,
//   CreateRoomResponse,
//   ConnectTransportResponse,
//   useConsumerProps,
//   CreateConsumerResponse,
// } from '../types/mediasoupTypes';
// import { useSocket } from './useSocket';

// export const useConsumer = ({ socketUrl, liveId = '' }: useConsumerProps) => {
//   const rtpCapabilitiesRef = useRef<RtpCapabilities | null>(null);
//   const transport = useRef<Transport | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [mediastream, setMediastream] = useState<MediaStream | null>(null);
//   const { socket, isConnected, socketError } = useSocket(socketUrl);

//   const getRtpCapabilities = async (roomId: string) => {
//     if (!socket) return null;

//     try {
//       const rtpCapabilities: RtpCapabilities = await new Promise(resolve => {
//         socket.emit('getRtpCapabilities', { roomId }, (response: RtpCapabilitiesResponse) => {
//           console.log('rtp Capability');
//           resolve(response.rtpCapabilities);
//         });
//       });

//       rtpCapabilitiesRef.current = rtpCapabilities;
//       console.log('RTP capabilities 갖고옴');
//       return rtpCapabilities;
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error('RTP Capabilities 요청 실패');
//       console.error('RTP Capabilities 요청 중 에러:', error);
//       setError(error);
//       return null;
//     }
//   };

//   const createDevice = async () => {
//     try {
//       if (!rtpCapabilitiesRef.current) return null;

//       const device = new mediasoupClient.Device();
//       await device.load({
//         routerRtpCapabilities: rtpCapabilitiesRef.current,
//       });
//       console.log('Device 생성');
//       return device;
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error('Device 생성 실패');
//       console.error('Device 생성 실패:', error);
//       setError(error);
//       return null;
//     }
//   };

//   const createTransport = async (device: Device, roomId: string) => {
//     if (!socket || !device || !roomId) return;

//     try {
//       const transportResponse: CreateTransportResponse = await new Promise(resolve => {
//         if (liveId === '') {
//           socket.emit('createTransport', { liveId, isProducer: false }, (response: CreateTransportResponse) => {
//             console.log('transport 생성');
//             resolve(response);
//           });
//         } else {
//           socket.emit('createTransport', { roomId: liveId, isProducer: false }, (response: CreateTransportResponse) => {
//             console.log('transport 생성');
//             resolve(response);
//           });
//         }
//       });

//       const newTransport = device.createRecvTransport({
//         id: transportResponse.transportId,
//         iceParameters: transportResponse.iceParameters,
//         iceCandidates: transportResponse.iceCandidates,
//         dtlsParameters: transportResponse.dtlsParameters,
//       });

//       transport.current = newTransport;

//       transport.current.on('connect', async (parameters, callback) => {
//         try {
//           await new Promise<ConnectTransportResponse>((resolve, reject) => {
//             socket.emit(
//               'connectTransport',
//               {
//                 roomId: liveId,
//                 dtlsParameters: parameters.dtlsParameters,
//                 transportId: transportResponse.transportId,
//               },
//               (response: ConnectTransportResponse) => {
//                 if (response.connected) {
//                   console.log('connected: ', response.connected);
//                   console.log('isProducer: ', response.isProducer);
//                   callback();
//                   resolve(response); // resolve() 호출 수정
//                 } else {
//                   reject(new Error('Transport connection failed'));
//                 }
//               },
//             );
//           });
//           callback();
//         } catch (error) {
//           console.error('Transport connect error:', error);
//           setError(error instanceof Error ? error : new Error('Unknown transport error'));
//         }
//       });

//       socket.emit(
//         'createConsumer',
//         {
//           roomId: liveId,
//           transportId: transportResponse.transportId,
//           rtpCapabilities: rtpCapabilitiesRef.current,
//         },
//         async ({ consumers }: CreateConsumerResponse) => {
//           const newMediastream = new MediaStream();
//           setMediastream(newMediastream);

//           console.log('consumers:', consumers);
//           for (const consumerData of consumers) {
//             try {
//               const consumer = await transport.current?.consume({
//                 id: consumerData.consumerId,
//                 producerId: consumerData.producerId,
//                 rtpParameters: consumerData.rtpParameters,
//                 kind: consumerData.kind,
//               });

//               if (consumer!.track.kind === 'video') {
//                 consumer!.track.enabled = true;
//               }

//               newMediastream.addTrack(consumer!.track);
//               setMediastream(new MediaStream([...newMediastream.getTracks()]));

//               await consumer!.resume;
//             } catch (err) {
//               setError(err instanceof Error ? err : new Error('consume 에러'));
//             }
//           }
//         },
//       );
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error('Transport 생성 에러');
//       console.error('Transport 생성 중 에러:', error);
//       setError(error);
//     }
//   };

//   const initializeMediasoup = async () => {
//     try {
//       if (!socket) {
//         console.log('소켓이 없습니다');
//         return;
//       }

//       const { roomId } = await new Promise<CreateRoomResponse>(resolve => {
//         socket.emit('createRoom', (response: CreateRoomResponse) => {
//           resolve(response);
//         });
//       });
//       const rtpCapabilities = await getRtpCapabilities(roomId);
//       if (!rtpCapabilities) return;

//       const device = await createDevice();
//       if (!device) return;

//       console.log('Room id: ', roomId);

//       await createTransport(device, roomId);
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error('Mediasoup 초기화 중 에러');
//       console.error('Mediasoup 초기화 중 에러:', error);
//       setError(error);
//     }
//   };

//   useEffect(() => {
//     if (socketError) {
//       setError(socketError);
//       return;
//     }

//     initializeMediasoup();

//     return () => {
//       if (transport.current) {
//         transport.current.close();
//       }
//       if (mediastream) {
//         mediastream.getTracks().forEach(track => track.stop());
//         setMediastream(null);
//       }
//     };
//   }, [isConnected]);

//   return {
//     transport: transport.current,
//     mediastream,
//     error,
//   };
// };
