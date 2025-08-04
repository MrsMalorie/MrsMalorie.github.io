import type { JSX } from "react";

export interface LoadSpinnerProps {
    is_loading: boolean;
    loaded_content?: JSX.Element;
};

export default function LoadSpinner(props: LoadSpinnerProps) {
    if (props.is_loading) {
        return (
            <div className="flex items-center mx-auto w-fit">
                <div className={`
                    animate-spin size-4 border-2 border-current mr-2
                    border-t-transparent rounded-full
                `}></div>
                <p>Loading...</p>
            </div>
        );
    }

    return props.loaded_content;
}