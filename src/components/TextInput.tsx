import { JSX } from "solid-js";

export interface TextInputProps {
    icon?: JSX.Element;
    maxLength?: number;
    placeholder?: string;

    value?: string;
    onValueChange?: (value: string) => void;
}

export default function TextInput(props: TextInputProps) {
    let inputRef: HTMLInputElement | undefined = undefined;

    return (
        <div
            class="bg-white rounded-full border px-3 py-2 flex items-center gap-2 text-md cursor-text"
            onClick={() => {
                inputRef?.focus();
            }}
        >
            {props.icon}
            <input
                ref={(el) => { inputRef = el; }}
                style={{ all: "unset", "flex-grow": 1 }}
                type="text"
                placeholder={props.placeholder}
                maxLength={props.maxLength ?? 255}
                value={props.value}
                onInput={(ev) => props.onValueChange ? props.onValueChange(ev.currentTarget.value) : {}}
            />
        </div>
    );
}