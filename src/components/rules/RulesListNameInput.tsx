interface RulesListNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function RulesListNameInput({
  value,
  onChange,
}: RulesListNameInputProps) {
  return (
    <div className="w-full space-y-2">
      <div className="w-full">
        <label className="label py-1">
          <span className="label-text text-xs text-base-content/70">
            Rules List Name <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a name for this rules list..."
          className="input input-bordered input-primary w-full"
          required
        />
      </div>
    </div>
  );
}

