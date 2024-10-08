import React from 'react';

export default function Discard({ postId }) {
  const handleDiscard = async () => {
    // Prompt the user for the secret
    const secret = prompt("Please enter the secret to discard this post:");
    
    // If the user cancels the prompt or enters an empty string, abort the operation
    if (!secret) {
      console.log('Discard operation cancelled');
      return;
    }

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'discard',
          postId: postId,
          secret: secret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to discard post');
      }

      const data = await response.json();
      // Handle successful discard
      console.log('Post discarded successfully', data);
      // You might want to trigger some UI update here
    } catch (error) {
      console.error('Error discarding post:', error);
      // Handle error (e.g., show an error message to the user)
      alert('Failed to discard post. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDiscard}
      className="px-4 py-2 bg-rose-500 text-per-neutral-900 font-semibold rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-all duration-200 border border-per-neutral-200 shadow-sm hover:shadow-md"
    >
      Discard
    </button>
  );
};