//hooks/use-vapi.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

// Define interfaces for better type safety
interface VapiMessage {
  type: string;
  transcriptType?: string;
  role: string;
  transcript: string;
}

interface UseVapiOptions {
  publicKey: string;
  assistantId: string;
}

const useVapi = (options: UseVapiOptions) => {
  const { publicKey, assistantId } = options;
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversation, setConversation] = useState<{ role: string, text: string }[]>([]);
  const vapiRef = useRef<Vapi | null>(null);
 
  const initializeVapi = useCallback(() => {
    if (!vapiRef.current && publicKey) {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;
 
      vapiInstance.on('call-start', () => {
        setIsSessionActive(true);
      });
 
      vapiInstance.on('call-end', () => {
        setIsSessionActive(false);
        setConversation([]); // Reset conversation on call end
      });
 
      vapiInstance.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });
 
      vapiInstance.on('message', (message: VapiMessage) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          setConversation((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      });
 
      vapiInstance.on('error', (e: Error) => {
        console.error('Vapi error:', e);
      });
    }
  }, [publicKey]);
 
  useEffect(() => {
    initializeVapi();
 
    // Cleanup function to end call and dispose Vapi instance
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);
 
  const toggleCall = async () => {
    try {
      if (isSessionActive) {
        await vapiRef.current?.stop();
      } else {
        await vapiRef.current?.start(assistantId);
      }
    } catch (err) {
      console.error('Error toggling Vapi session:', err);
    }
  };
 
  return { volumeLevel, isSessionActive, conversation, toggleCall };
};
 
export default useVapi;