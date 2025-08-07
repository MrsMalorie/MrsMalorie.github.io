export interface SelectSliderProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
};

export default function SelectSlider(props: SelectSliderProps) {
    return (
        <button
            onClick={() => props.onValueChange(!props.value)}
            className={`
                border w-14 rounded-full h-8 cursor-pointer
                transition-[background-color] duration-300
                ${props.value
                    ? "bg-[#c3e1db]"
                    : "bg-gray-200"
                }
            `}
        >
            <div
                className={`
                    size-6 rounded-full my-auto transition-[margin-left,margin-right]
                    duration-300 ease-in-out bg-white shadow-sm/50
                    ${props.value
                        ? "ml-[calc(100%-1.75em)] mr-1"
                        : "ml-1 mr-[calc(100%-1.75em)]"
                    }
                `}
            ></div>
        </button>
    );
}