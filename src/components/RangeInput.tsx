export interface RangeInputProps {
    min?: number;
    max?: number;

    minValue: number;
    maxValue: number;

    onMinValueChange: (value: number) => void;
    onMaxValueChange: (value: number) => void;
}

export default function RangeInput(props: RangeInputProps) {
    let minRef: HTMLInputElement | undefined = undefined;
    let maxRef: HTMLInputElement | undefined = undefined;

    return (
        <div class="flex flex-col gap-2 items-end">
            <div class="inline-flex gap-2 items-center">
                <span>Low:</span>
                <div
                    class="bg-white rounded-full border px-3 py-2 flex items-center gap-2 text-md cursor-text"
                    onClick={() => {
                        minRef?.focus();
                    }}
                >
                    <input
                        ref={(el) => { minRef = el; }}
                        style={{ all: "unset", "flex-grow": 1 }}
                        type="number"
                        min={props.min}
                        max={props.max}
                        value={props.minValue.toString()}
                        onInput={(ev) => {
                            const value = ev.currentTarget.valueAsNumber;
                            const lo = props.min ?? -Infinity;
                            const hi = props.max ?? Infinity;
                            const clamped = Math.min(Math.max(value, lo), hi);
                            props.onMinValueChange(Math.min(clamped, props.maxValue));
                        }}
                    />
                </div>
            </div>

            <div class="inline-flex gap-2 items-center">
                <span>High:</span>
                <div
                    class="bg-white rounded-full border px-3 py-2 flex items-center gap-2 text-md cursor-text"
                    onClick={() => {
                        maxRef?.focus();
                    }}
                >
                    <input
                        ref={(el) => { maxRef = el; }}
                        style={{ all: "unset", "flex-grow": 1 }}
                        type="number"
                        min={props.min}
                        max={props.max}
                        value={props.maxValue.toString()}
                        onInput={(ev) => {
                            const value = ev.currentTarget.valueAsNumber;
                            const lo = props.min ?? -Infinity;
                            const hi = props.max ?? Infinity;
                            const clamped = Math.min(Math.max(value, lo), hi);
                            props.onMaxValueChange(Math.max(clamped, props.minValue));
                        }}
                    />
                </div>
            </div>
        </div>
    );
}