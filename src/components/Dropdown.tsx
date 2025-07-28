type DropdownProps = {
    options: string[];
    onOptionSelect: (value: string) => void;
};

export default function Dropdown({
    options,
    onOptionSelect
}: DropdownProps) {
    return (
        <div>
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