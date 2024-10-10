export default function Visibility({ postId, isDraft, slug }) {
  const handleVisibilityChange = async () => {
    const action = isDraft ? 'publish' : 'unpublish';
    const secret = prompt(`Please enter the secret to ${action} this post:`);
    
    if (!secret) {
      console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} operation cancelled`);
      return;
    }

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action,
          postId: postId,
          secret: secret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} post`);
      }

      const data = await response.json();
      console.log(`Post ${action}ed successfully`, data);
      // Redirect to the appropriate URL based on the new state
      const newPath = isDraft ? `/blog/${slug}` : `/blog/draft/${slug}`;
      window.location.href = newPath;
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      alert(`Failed to ${action} post. Please try again.`);
    }
  };

  return (
    <button
      onClick={handleVisibilityChange}
      className={`px-4 py-2 ${
        isDraft
          ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500'
          : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500'
      } text-per-neutral-900 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 border border-per-neutral-200 shadow-sm hover:shadow-md`}
    >
      {isDraft ? 'Publish' : 'Unpublish'}
    </button>
  );
}
