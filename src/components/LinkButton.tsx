import { JSX } from "solid-js";

interface LinkButtonProps {
    href: string;
    label: string | JSX.Element;

    class?: string;
}

export default function LinkButton(props: LinkButtonProps) {
    return (
        <a class={`block ${props.class ?? ""}`} href={props.href}>
            <div class="bg-white rounded-2xl ease-in-out hover:bg-[#f5f3f5] shadow-[0_8px_0_0_rgba(0,0,0,0.15)] transition duration-150 px-6 py-3 hover:translate-y-[4px] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.15)] text-center text-md md:text-lg">
                {props.label}
            </div>
        </a>
    )
}