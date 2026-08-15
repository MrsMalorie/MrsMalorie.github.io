export interface BooleanInputProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export default function BooleanInput(props: BooleanInputProps) {
    return (
        <div
            class="border w-fit h-fit rounded-full cursor-pointer"
            onClick={() => props.onValueChange(!props.value)}
        >
            <div class={`w-14 h-8 relative rounded-full ${props.value
                ? "bg-white"
                : "bg-gray-200"
            }`}>
                <div class={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transition duration-300 ease-in-out text-[10px]/6 flex items-center justify-center ${props.value
                    ? "bg-green-300 translate-x-6 text-green-800"
                    : "bg-white text-red-700"
                }`}>
                    {props.value ? "YES" : "NO"}
                </div>
            </div>
        </div>
    );
}