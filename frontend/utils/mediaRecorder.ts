export async function requestMicrophone(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
  });
}

export function createMediaRecorder(
  stream: MediaStream
): MediaRecorder {
  return new MediaRecorder(stream);
}

export function stopMediaTracks(stream: MediaStream | null) {
  if (!stream) return;

  stream.getTracks().forEach((track) => track.stop());
}

export function createAudioBlob(
  chunks: Blob[],
  mimeType: string
): Blob {
  return new Blob(chunks, {
    type: mimeType || "audio/webm",
  });
}