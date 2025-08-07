import InputBar from "./InputBar";

export interface RangeInputBarProps {
    low_value: number;
    high_value: number;
    
    onLowValueChange: (value: number) => void;
    onHighValueChange: (value: number) => void;

    lower_bound: number;
    upper_bound: number;

    value_on_boundary?: boolean;

    class?: string
};

function clamp(value: number, lower_bound: number, upper_bound: number) {
    console.log(value, lower_bound, upper_bound, Math.max(lower_bound, Math.min(upper_bound, value)))
    return Math.max(lower_bound, Math.min(upper_bound, value));
}

export default function RangeInputBar(props: RangeInputBarProps) {
    return (
        <table className={props.class}>
            <tbody>
                <tr>
                    <td className="text-[#83aba3] text-right pr-2">Low</td>
                    <td>
                        <InputBar
                            value={
                                props.value_on_boundary
                                    ? props.low_value.toString()
                                    : (props.low_value == props.lower_bound
                                        ? '' : props.low_value.toString()
                                    )
                            }
                            onValueChange={(value: string) => props.onLowValueChange(clamp(
                                value ? Number(value) : props.lower_bound,
                                props.lower_bound,
                                props.high_value
                            ))}
                            input_type="number"
                            class="mb-1 w-25"
                        />
                    </td>
                </tr>

                <tr>
                    <td className="text-[#b8817a] text-right pr-2 pt-2">High</td>
                    <td>
                        <InputBar
                            value={
                                props.value_on_boundary
                                    ? props.high_value.toString()
                                    : (props.high_value == props.upper_bound
                                        ? '' : props.high_value.toString()
                                    )
                            }
                            onValueChange={(value: string) => props.onHighValueChange(clamp(
                                value ? Number(value) : props.upper_bound,
                                props.low_value,
                                props.upper_bound
                            ))}
                            input_type="number"
                            class="w-25"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}