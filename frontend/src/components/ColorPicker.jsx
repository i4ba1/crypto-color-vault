import { HexColorPicker } from "react-colorful";

export default function ColorPicker({ color, onChange, disabled }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-300">Pick Your Color</h2>

      <div className={`${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <HexColorPicker color={color} onChange={onChange} />
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-600 shadow-lg"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => {
            let val = e.target.value.toUpperCase();
            if (!val.startsWith("#")) val = "#" + val.replace(/^#+/, "");
            val = val.replace(/[^#0-9A-F]/g, "").slice(0, 7);
            onChange(val);
          }}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-center font-mono text-lg w-32 focus:outline-none focus:border-purple-500"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
