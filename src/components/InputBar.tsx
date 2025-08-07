export interface InputBarProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    input_type?: "text" | "number";
    bar_icon?: string;
    class?: string;
};

export default function InputBar(props: InputBarProps) {
    return (
        <div 
            className={`
                flex items-center border bg-white rounded-full px-3 py-1 ${props.class}
            `}
        >
            {props.bar_icon && <img src={props.bar_icon} className="size-4 mr-2" />}
            <input
                style={{ all: 'unset', flexGrow: 1, width: "100%" }}
                type={props.input_type ?? "text"}
                placeholder={props.placeholder}
                value={props.value}
                onChange={(change_event) => {
                    props.onValueChange(change_event.currentTarget.value);
                }}
            />
        </div>
    );
}