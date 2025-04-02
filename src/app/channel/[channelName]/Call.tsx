"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  useVolumeLevel,
} from "agora-rtc-react";

function Call(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos(props: { channelName: string; AppID: string }) {
  const { AppID, channelName } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const muteRemoteAudio = (audioTrack: IRemoteAudioTrack | null) => {
    if (!audioTrack) return;
    audioTrack.setVolume(0);
  };

  // Unmute remote audio
  const unmuteRemoteAudio = (audioTrack: IRemoteAudioTrack | null) => {
    if (!audioTrack) return;
    audioTrack.setVolume(100);  // Set to a reasonable volume level
  };
  // Mute local audio
  const muteLocalAudio = (audioTrack: IMicrophoneAudioTrack | null) => {
    if (!audioTrack) return;
    audioTrack.setVolume(0);
  };

  // Unmute local audio
  const unmuteLocalAudio = (audioTrack: IMicrophoneAudioTrack | null) => {
    if (!audioTrack) return;
    audioTrack.setVolume(100);  // Set the volume to a reasonable volume level
  };
  // Component to track and display the local user's audio volume level
  const AudioVolumeTracker = ({ audioTrack }: { audioTrack?: IMicrophoneAudioTrack }) => {
    const volumeLevel = useVolumeLevel(audioTrack);

    return (
      <div>
        <label>Current Volume Level: {volumeLevel}</label>
      </div>
    );
  };

  // Component to track and display the remote user's audio volume level
  const RemoteAudioVolumeTracker = ({ audioTrack }: { audioTrack?: IRemoteAudioTrack }) => {
    const volumeLevel = useVolumeLevel(audioTrack);

    return (
      <div>
        <label>Remote User's Volume Level: {volumeLevel}</label>
      </div>
    );
  };
  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
  });

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );
  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className={`grid  gap-1 flex-1`}
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />
        {remoteUsers.map((user) => (
          <div>
            <div>
            <button
              onClick={() => muteLocalAudio(localMicrophoneTrack)}
            >
              Mute local user
            </button>
            <button
              onClick={() => unmuteLocalAudio(localMicrophoneTrack)}
            >
              Unmute local user
            </button>
            <button
              onClick={() => muteRemoteAudio(user.audioTrack || null)}
            >
              Mute remote user
            </button>
            <button
              onClick={() => unmuteRemoteAudio(user.audioTrack || null)}
            >
              Unmute remote user
            </button>
          </div>
          <RemoteAudioVolumeTracker audioTrack={user?.audioTrack}/>
            <RemoteUser user={user} />
            
          </div>
          
        ))}
      </div>
    </div>
  );
}

export default Call;