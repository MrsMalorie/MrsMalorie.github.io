export interface DropdownItem {
    tag: string;
    value: any;
};

export interface DropdownProps {
    value: DropdownItem;
    options: DropdownItem[];
    onValueChange: (item: DropdownItem) => void;
};

export default function Dropdown(props: DropdownProps) {
    return <>
        <select className="border bg-white rounded-full px-3 py-1" >
            {props.options.map((item: DropdownItem, index: number) => (
                <option value={item.value} key={`Dropdown-Item-${index}`}>
                    {item.tag}
                </option>
            ))}
        </select>
    </>
}