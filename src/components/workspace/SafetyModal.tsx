import { useState, useEffect } from 'react';

interface SafetyRequirement {
  key: string;
  title: string;
  description: string;
  category: 'safety' | 'licensing' | 'ethics' | 'community';
}

interface SafetyModalProps {
  contentSlug: string;
  contentType: 'project' | 'subproject' | 'update';
  requirements: SafetyRequirement[];
  onAcknowledge: () => void;
  researcherName?: string;
}

export default function SafetyModal({
  contentSlug,
  contentType,
  requirements,
  onAcknowledge,
  researcherName = 'the researcher'
}: SafetyModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize all checkboxes as unchecked
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    requirements.forEach(req => {
      initial[req.key] = false;
    });
    setCheckedItems(initial);
  }, [requirements]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Prevent Escape key from closing modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  const handleCheckboxChange = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allChecked = requirements.every(req => checkedItems[req.key] === true);

  const handleSubmit = async () => {
    if (!allChecked) {
      setError('Please acknowledge all requirements to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/safety/acknowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_slug: contentSlug,
          content_type: contentType,
          acknowledged_requirements: requirements.map(req => req.key),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record acknowledgment');
      }

      // Success - call the callback to refresh the page or update state
      onAcknowledge();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety':
        return 'text-red-600 dark:text-red-400';
      case 'licensing':
        return 'text-blue-600 dark:text-blue-400';
      case 'ethics':
        return 'text-purple-600 dark:text-purple-400';
      case 'community':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety':
        return '⚠️';
      case 'licensing':
        return '📄';
      case 'ethics':
        return '🤝';
      case 'community':
        return '👥';
      default:
        return '📋';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()} // Prevent click-through
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl mt-1">🔒</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Safety Acknowledgment Required</h2>
              <p className="text-red-100 text-sm">
                This content has been marked as gated by {researcherName}. You must read and acknowledge each requirement below before accessing it.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info box */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Why is this content gated?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Certain research materials may contain sensitive information, require licensing acknowledgment,
              or have ethical considerations. These gates ensure you understand the context and responsibilities
              before accessing the content.
            </p>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Please review and acknowledge each requirement:
            </h3>

            {requirements.map((requirement) => (
              <div
                key={requirement.key}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedItems[requirement.key] || false}
                    onChange={() => handleCheckboxChange(requirement.key)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getCategoryIcon(requirement.category)}</span>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {requirement.title}
                      </h4>
                      <span className={`text-xs font-medium uppercase ${getCategoryColor(requirement.category)}`}>
                        {requirement.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {requirement.description}
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {requirements.length} requirement{requirements.length !== 1 ? 's' : ''} • {
                Object.values(checkedItems).filter(Boolean).length
              } acknowledged
            </p>

            <button
              onClick={handleSubmit}
              disabled={!allChecked || isSubmitting}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                allChecked && !isSubmitting
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'I Acknowledge - Access Content'
              )}
            </button>
          </div>

          {/* Security notice */}
          <div className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p>🔐 Your acknowledgment will be recorded and stored permanently. This modal cannot be bypassed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
