export interface DropdownProps {
    value: string;
    onValueChange: (value: string) => void;
    options: string[];
}

export default function Dropdown(props: DropdownProps) {
    return (
        <select
            class="bg-white border rounded-full px-3 py-2"
            value={props.value}
            onChange={(ev) => props.onValueChange(ev.currentTarget.value)}
        >
            {props.options.map((option) => (
                <option value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}