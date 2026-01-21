// Modal.jsx
import { useEffect, useRef } from 'react';

export default function Modal({ title, children, onCancel, onConfirm, confirmText, danger = false }) {
  const modalRef = useRef();
  const previouslyFocusedElement = useRef();

  useEffect(() => {
    // Store the currently focused element before modal opens
    previouslyFocusedElement.current = document.activeElement;
    
    // Focus the modal container
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Trap focus within modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      // Focus trapping logic
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function - CRITICAL for desktop apps
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      setTimeout(() => {
        if (previouslyFocusedElement.current) {
          try {
            previouslyFocusedElement.current.focus();
          } catch {
            // If focus restoration fails, reset focus state
            document.body.focus();
            document.body.blur();
          }
        } else {
          // Force focus reset for desktop apps
          document.body.focus();
          document.body.blur();
        }
        
        // Additional fix for Electron apps
        setTimeout(() => {
          // Re-enable all inputs after modal closes
          document.querySelectorAll('input, textarea').forEach(input => {
            input.style.pointerEvents = 'auto';
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
          });
        }, 50);
      }, 100);
    };
  }, [onCancel]);

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-[#2F5D55] mb-4">{title}</h3>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded text-white transition ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#89AE29] hover:bg-[#2e5f52]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}