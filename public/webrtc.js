let localStream;
let remoteStream;
let localPeerConnection;
let remotePeerConnection;


const socket = io.connect('http://localhost:3000');
const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

startButton.addEventListener('click', startCall);
hangupButton.addEventListener('click', hangUp);

socket.on('offer', async (offer) => {
  if (!localPeerConnection) await startCall();

  await remotePeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await remotePeerConnection.createAnswer();
  await remotePeerConnection.setLocalDescription(answer);
  socket.emit('answer', answer);
});

socket.on('answer', async (answer) => {
  await localPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', async (candidate) => {
  const iceCandidate = new RTCIceCandidate(candidate);
  await (localPeerConnection || remotePeerConnection).addIceCandidate(iceCandidate);
});

async function startCall() {
    console.log("Starting call ")
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  const servers = null;

  localPeerConnection = new RTCPeerConnection(servers);
  remotePeerConnection = new RTCPeerConnection(servers);

  localPeerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate);
    }
  });

  remotePeerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate);
    }
  });

  remotePeerConnection.addEventListener('track', event => {
    remoteStream = event.streams[0];
    remoteVideo.srcObject = remoteStream;
  });

  localStream.getTracks().forEach(track => {
    localPeerConnection.addTrack(track, localStream);
  });

  const offer = await localPeerConnection.createOffer();
  await localPeerConnection.setLocalDescription(offer);
  socket.emit('offer', offer);

  await remotePeerConnection.setRemoteDescription(offer);
  const answer = await remotePeerConnection.createAnswer();
  await remotePeerConnection.setLocalDescription(answer);
  socket.emit('answer', answer);
}

function hangUp() {
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  socket.emit('disconnect');
}
