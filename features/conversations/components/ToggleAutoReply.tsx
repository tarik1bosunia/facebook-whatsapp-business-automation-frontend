// components/ToggleAutoReplyButton.tsx

'use client';

import { useToggleAutoReplyMutation } from '@/lib/redux/services/conversationApi';
import { useState } from 'react';

interface Props {
  id: string;
  currentAutoReply: boolean;
}

export default function ToggleAutoReplyButton({ id, currentAutoReply }: Props) {
  const [toggleAutoReply, { isLoading }] = useToggleAutoReplyMutation();
  const [autoReplyState, setAutoReplyState] = useState(currentAutoReply);

  const handleToggle = async () => {
    try {
      const updated = await toggleAutoReply({ id, auto_reply: !autoReplyState }).unwrap();
      setAutoReplyState(updated.auto_reply);
    } catch (error) {
      console.error('Failed to update auto reply:', error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"

      >
      {autoReplyState ? 'Turn Auto Reply Off' : 'Turn Auto Reply On'}
    </button>
  );
}
