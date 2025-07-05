
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AudioRecorderProps {
  onAudioRecord: (audioData: any) => void;
}

const AudioRecorder = ({ onAudioRecord }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      toast.error("Could not access microphone");
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl("");
    setDuration(0);
    setIsPlaying(false);
  };

  const handleSendAudio = () => {
    if (audioBlob) {
      const audioData = {
        blob: audioBlob,
        url: audioUrl,
        duration: duration,
        type: 'audio/wav'
      };
      onAudioRecord(audioData);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {!audioBlob ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
            }`}>
              <Mic className={`w-8 h-8 ${isRecording ? 'text-red-600' : 'text-gray-600'}`} />
            </div>
          </div>
          
          <div className="text-lg font-medium">
            {isRecording ? formatTime(duration) : "Ready to record"}
          </div>
          
          <div className="flex justify-center space-x-2">
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-medium">Recording Complete</div>
            <div className="text-gray-500">Duration: {formatTime(duration)}</div>
          </div>
          
          <div className="flex justify-center space-x-2">
            {!isPlaying ? (
              <Button onClick={playAudio} variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            ) : (
              <Button onClick={pauseAudio} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={resetRecording} variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
          
          <Button onClick={handleSendAudio} className="w-full bg-green-600 hover:bg-green-700">
            Send Audio
          </Button>
          
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;