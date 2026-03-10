import { useState, useEffect } from "react";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Vapi from "@vapi-ai/web";

const VAPI_ASSISTANT_ID = "6c2af3ac-b446-4053-9f45-09a93b4bfc9d";

interface VoiceAgentProps {
  disabled?: boolean;
}

export function VoiceAgent({ disabled = false }: VoiceAgentProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [vapi, setVapi] = useState<Vapi | null>(null);

  useEffect(() => {
    const vapiInstance = new Vapi();
    setVapi(vapiInstance);

    return () => {
      if (vapiInstance.isSessionActive()) {
        vapiInstance.stop();
      }
    };
  }, []);

  const handleStartCall = async () => {
    if (!vapi) return;

    try {
      await vapi.start(VAPI_ASSISTANT_ID);
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleEndCall = async () => {
    if (!vapi) return;

    try {
      vapi.stop();
      setIsCallActive(false);
      setIsMuted(false);
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleToggleMute = () => {
    if (!vapi || !isCallActive) return;

    try {
      if (isMuted) {
        vapi.unmute();
      } else {
        vapi.mute();
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  if (!isCallActive) {
    return (
      <button
        onClick={handleStartCall}
        disabled={disabled}
        className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium
                   shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] 
                   hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                   disabled:hover:translate-y-0 transition-all duration-200"
        data-testid="button-voice-call"
      >
        <Phone className="w-4 h-4" />
        <span>Start Voice Call</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleMute}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
          isMuted
            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
        )}
        data-testid="button-toggle-mute"
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      <button
        onClick={handleEndCall}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
        data-testid="button-end-call"
      >
        <PhoneOff className="w-5 h-5" />
      </button>

      <span className="text-sm font-medium text-blue-400">Call Active</span>
    </div>
  );
}
