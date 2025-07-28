type InputBarProps = {
    placeholder: string | null;
    value: string | null;
    label: string | null;
    type: string | null;
    valueChangeCallback: (text: string) => void;
};

export default function InputBar({
    placeholder,
    value,
    label,
    type,
    valueChangeCallback
}: InputBarProps) {
    return (
        <div className="flex">
            <p>{label}</p>
            <input
                placeholder={placeholder ?? ''}
                value={value ?? ''}
                type={type ?? ''}
                onChange={(ev) => {
                    valueChangeCallback(ev.currentTarget.value)
                }}
            />
        </div>
    );
}