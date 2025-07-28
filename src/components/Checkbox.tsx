type CheckboxProps = {
    value: boolean | null;
    onValueChange: (value: boolean) => void;
};

export default function Checkbox({
    value,
    onValueChange
}: CheckboxProps) {
    return (
        <div>
            <button onClick={() => {
                onValueChange(!value);
            }}>
                {value ? "YES" : "NO"}
            </button>
        </div>
    )
}