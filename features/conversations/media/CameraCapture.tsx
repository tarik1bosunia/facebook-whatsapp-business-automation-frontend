
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, X, Video, Square } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageData: any) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [capturedVideo, setCapturedVideo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: mode === 'video'
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error("Could not access camera");
      console.error("Error accessing camera:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
  };

  const startVideoRecording = async () => {
    if (!stream) return;

    try {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setCapturedVideo(videoUrl);
        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      toast.error("Could not start video recording");
      console.error("Error starting video recording:", error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const retakeMedia = () => {
    setCapturedImage("");
    setCapturedVideo("");
    setRecordingTime(0);
  };

  const handleSendMedia = () => {
    if (capturedImage) {
      // Handle photo
      const byteString = atob(capturedImage.split(',')[1]);
      const mimeString = capturedImage.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      
      const imageData = {
        blob: blob,
        url: capturedImage,
        type: mimeString,
        name: `camera-photo-${Date.now()}.jpg`
      };
      
      onCapture(imageData);
    } else if (capturedVideo) {
      // Handle video
      fetch(capturedVideo)
        .then(res => res.blob())
        .then(blob => {
          const videoData = {
            blob: blob,
            url: capturedVideo,
            type: 'video/webm',
            name: `camera-video-${Date.now()}.webm`
          };
          onCapture(videoData);
        });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const switchMode = (newMode: 'photo' | 'video') => {
    setMode(newMode);
    retakeMedia();
    // Restart camera with/without audio based on mode
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    startCamera();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <div className="text-gray-600">Starting camera...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex justify-center space-x-2">
        <Button
          variant={mode === 'photo' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('photo')}
          className="flex items-center space-x-2"
        >
          <Camera className="w-4 h-4" />
          <span>Photo</span>
        </Button>
        <Button
          variant={mode === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('video')}
          className="flex items-center space-x-2"
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </Button>
      </div>

      <div className="relative">
        {!capturedImage && !capturedVideo ? (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {mode === 'photo' ? (
                <Button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:border-gray-400"
                  variant="ghost"
                >
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-400"></div>
                </Button>
              ) : (
                <Button
                  onClick={isRecording ? stopVideoRecording : startVideoRecording}
                  className={`w-16 h-16 rounded-full border-4 ${
                    isRecording 
                      ? 'bg-red-600 border-red-300 hover:bg-red-700' 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                  variant="ghost"
                >
                  {isRecording ? (
                    <Square className="w-6 h-6 text-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-600 border-2 border-red-400"></div>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <video
                src={capturedVideo}
                controls
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
        )}
      </div>

      {(capturedImage || capturedVideo) ? (
        <div className="flex space-x-2">
          <Button onClick={retakeMedia} variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake
          </Button>
          <Button onClick={handleSendMedia} className="flex-1 bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            Send {mode === 'photo' ? 'Photo' : 'Video'}
          </Button>
        </div>
      ) : null}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;