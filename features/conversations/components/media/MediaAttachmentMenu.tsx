
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Image,
  Video,
  File,
  User,
  Mic,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import ContactPicker from "./ContactPicker";
import AudioRecorder from "./AudioRecorder";
import CameraCapture from "./CameraCapture";

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Phone {
  phone: string;
  type: "mobile" | "work" | "home";
}

interface Email {
  email: string;
  type: "personal" | "work";
}

interface Contact {
  name: string;
  phones: Phone[];
  emails: Email[];
}

interface AudioData {
  blob: Blob;
  url: string;
  duration: number;
}

interface ImageData {
  blob: Blob;
  url: string;
}

interface MediaAttachmentMenuProps {
  onAttachmentSelect: (type: string, data?: FileData | Contact | AudioData | ImageData) => void;
}

const MediaAttachmentMenu = ({ onAttachmentSelect }: MediaAttachmentMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const attachmentOptions = [
    { type: "document", icon: File, label: "Document", color: "bg-blue-500" },
    { type: "photo", icon: Image, label: "Photos", color: "bg-purple-500" },
    { type: "video", icon: Video, label: "Video", color: "bg-red-500" },
    { type: "contact", icon: User, label: "Contact", color: "bg-green-500" },
    { type: "audio", icon: Mic, label: "Audio", color: "bg-orange-500" },
    { type: "camera", icon: Camera, label: "Camera", color: "bg-pink-500" },
  ];

  const handleOptionClick = (type: string) => {
    setIsOpen(false);
    
    switch (type) {
      case "photo":
        photoInputRef.current?.click();
        break;
      case "video":
        videoInputRef.current?.click();
        break;
      case "document":
        documentInputRef.current?.click();
        break;
      case "contact":
        setShowContactPicker(true);
        break;
      case "audio":
        setShowAudioRecorder(true);
        break;
      case "camera":
        setShowCameraCapture(true);
        break;
      default:
        break;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileData = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };
      
      onAttachmentSelect(type, fileData);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} selected: ${file.name}`);
    }
    
    // Reset input
    event.target.value = '';
  };

  const handleContactSelect = (contact: Contact) => {
    onAttachmentSelect("contact", contact);
    setShowContactPicker(false);
    toast.success("Contact selected");
  };

  const handleAudioRecord = (audioData: AudioData) => {
    onAttachmentSelect("audio", audioData);
    setShowAudioRecorder(false);
    toast.success("Audio recorded");
  };

  const handleCameraCapture = (imageData: ImageData) => {
    onAttachmentSelect("camera", imageData);
    setShowCameraCapture(false);
    toast.success("Photo captured");
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="mb-1">
            <Plus className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side="top" 
          align="start" 
          className="w-64 p-3 bg-white border shadow-lg z-50"
          sideOffset={8}
        >
          <div className="grid grid-cols-3 gap-3">
            {attachmentOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.type}
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-20 p-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => handleOptionClick(option.type)}
                >
                  <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center mb-2`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">
                    {option.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e, "photo")}
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "video")}
      />
      
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "document")}
      />

      {/* Contact Picker Dialog */}
      <Dialog open={showContactPicker} onOpenChange={setShowContactPicker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Contact</DialogTitle>
          </DialogHeader>
          <ContactPicker onContactSelect={handleContactSelect} />
        </DialogContent>
      </Dialog>

      {/* Audio Recorder Dialog */}
      <Dialog open={showAudioRecorder} onOpenChange={setShowAudioRecorder}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Audio</DialogTitle>
          </DialogHeader>
          <AudioRecorder onAudioRecord={handleAudioRecord} />
        </DialogContent>
      </Dialog>

      {/* Camera Capture Dialog */}
      <Dialog open={showCameraCapture} onOpenChange={setShowCameraCapture}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Take Photo</DialogTitle>
          </DialogHeader>
          <CameraCapture onCapture={handleCameraCapture} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaAttachmentMenu;