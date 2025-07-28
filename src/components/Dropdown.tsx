type DropdownProps = {
    options: string[];
    label: string | null;
    onOptionSelect: (value: string) => void;
};

export default function Dropdown({
    options,
    label,
    onOptionSelect
}: DropdownProps) {
    return (
        <div>
            {label && <p>{label}</p>}
            <select onChange={(ev) => {
                onOptionSelect(ev.currentTarget.value);
            }}>
                {options.map((opt_value, index) => (
                    <option value={opt_value} key={`DropOpt-${index}`}>
                        {opt_value}
                    </option>
                ))}
            </select>
        </div>
    );
}