import { MetaProvider, Title } from "@solidjs/meta";
import LinkButton from "~/components/LinkButton";

interface BouncingBalloonProps {
    src: string;
    class?: string;
}

function BouncingBalloon(props: BouncingBalloonProps) {
    return (
        <img
            src={props.src}
            class={`absolute animate-[float_5s_ease-in-out_infinite] min-w-[100px] h-auto ${props.class ?? ""}`}
            loading="eager"
        />
    );
}

export default function HomePage() {
    return (
        <main class="bg-gradient-to-b from-blue-300 to-white w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <MetaProvider>
                <Title>Mrs. Malorie's Classroom</Title>
            </MetaProvider>

            {/* Header */}
            <div class="text-center z-5 text-shadow-lg/100 text-shadow-white">
                <h1 class="font-[Homemade_Apple] text-4xl sm:text-5xl lg:text-6xl mb-2">
                    Mrs. Malorie's<br/>Classroom
                </h1>
            </div>

            {/* Navigation */}
            <div class="flex flex-col items-center gap-4 mt-8 z-5">
                <LinkButton href="/class-library" label="Class Library" />
                <LinkButton href="/today" label="In Class Today" />
                <LinkButton href="/resources" label="Resources" />
            </div>

            {/* Background decoration */}
            <BouncingBalloon
                src="/assets/purple_hotair_balloon.webp"
                class="top-[20%] left-[5%] w-[6%]"
            />

            <BouncingBalloon
                src="/assets/red_hotair_balloon.webp"
                class="top-[5%] right-[15%] w-[10%]"
            />

            <BouncingBalloon
                src="/assets/teal_hotair_balloon.webp"
                class="bottom-[5%] right-[5%] w-[6%]"
            />

            <BouncingBalloon
                src="/assets/yellow_hotair_balloon.webp"
                class="bottom-[5%] left-[10%] w-[10%]"
            />

            <img
                src="/assets/cloud_long.webp"
                class="absolute animate-[slide-right_60s_linear_infinite] w-[20vw] top-[2%] min-w-[200px]"
                style={`animation-delay: ${Math.random() * -60.0}s;`}
            />

            <img
                src="/assets/cloud_plump.webp"
                class="absolute animate-[slide-left_60s_linear_infinite] w-[20vw] bottom-[2%] min-w-[200px]"
                style={`animation-delay: ${Math.random() * -60.0}s;`}
            />
        </main>
    );
}
