import InputBar from "./InputBar";

type RangeInputProps = {
    label: string | null;

    low_value: number;
    high_value: number;

    min_value: number;
    max_value: number;

    lowChangeCallback: (value: number) => void;
    highChangeCallback: (value: number) => void;
};

export default function RangeInput({
    label,
    low_value,
    high_value,
    min_value,
    max_value,
    lowChangeCallback,
    highChangeCallback
}: RangeInputProps) {
    return (
        <div className="flex">
            {label && <p>{label}</p>}
            <div>
                <InputBar
                    placeholder={null}
                    value={low_value == min_value ? '' : low_value.toString()}
                    label={"Low"}
                    type={"number"}
                    valueChangeCallback={(text: string) => {
                        if (text.length == 0) {
                            lowChangeCallback(min_value);
                            return;
                        }

                        const num: number = Number(text);

                        if (num > high_value) {
                            lowChangeCallback(high_value);
                            return;
                        } else if (num < 0) {
                            lowChangeCallback(min_value);
                            return;
                        }

                        lowChangeCallback(num);
                    }}
                />

                <InputBar
                    placeholder={null}
                    value={high_value == max_value ? '' : high_value.toString()}
                    label={"High"}
                    type={"number"}
                    valueChangeCallback={(text: string) => {
                        if (text.length == 0) {
                            highChangeCallback(max_value);
                            return;
                        }

                        const num: number = Number(text);

                        if (num < low_value) {
                            highChangeCallback(low_value);
                            return;
                        } else if (num > max_value) {
                            highChangeCallback(max_value);
                            return;
                        }

                        highChangeCallback(num);
                    }}
                />
            </div>
        </div>
    );
}