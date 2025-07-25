// UnitSelector.jsx
export default function UnitSelector({ value, setValue, max = 9999, label, price, points }) {
  return (
    <>
      <label className="text-sm text-[#2F5D55] mb-2 block">{label}</label>
      <div className="flex items-center gap-2 mb-4">
        <button
          className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
          onClick={() => setValue((prev) => Math.max(1, prev - 1))}
        >-</button>
        <input
          type="number"
          readOnly
          min={1}
          max={max}
          value={value}
          className="w-full text-center p-2 rounded bg-[#f9f3d9] shadow-sm text-gray-700"
        />
        <button
          className="px-3 py-1 bg-[#dbe6a6] rounded text-[#2F5D55] hover:bg-[#c3d98a]"
          onClick={() => setValue((prev) => Math.min(max, prev + 1))}
        >+</button>
      </div>
      {price != null && points != null && (
        <div className="text-sm text-gray-600 mb-2 bg-gray-50 p-3 rounded">
          <div>Price: ₱{(value * price).toFixed(2)}</div>
          <div>Points: {value * points}</div>
        </div>
      )}
    </>
  );
}
