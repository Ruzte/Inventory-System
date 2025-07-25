// Modal.jsx
export default function Modal({ title, children, onCancel, onConfirm, confirmText, danger = false }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-lg font-bold text-[#2F5D55] mb-4">{title}</h3>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
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
