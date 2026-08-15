import { getOrdinal } from "../lib/utils/string";
import SlideController from "../lib/controllers/SlideController";
import { createSignal, onMount } from "solid-js";
import { TitleSlide } from "../lib/types/TitleSlide";

export default function TodayPage() {
    const today = new Date();
    const [titleSlide, setTitleSlide] = createSignal<TitleSlide | null>(null);

    const [showAmericanFlag, setShowAmericanFlag] = createSignal<boolean>(false);
    const [showOklahomaFlag, setShowOklahomaFlag] = createSignal<boolean>(false);

    onMount(async () => {
        try {
            setTitleSlide(await SlideController.getTitleSlide());
        } catch (ex) {

        }
    });

    return (
        <main class="bg-gradient-to-b from-blue-300 to-white w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden">
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

            <div class="text-center z-10">
                <p class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.5rem]">
                    {
                        today.toLocaleString('en-US', { month: 'long' })
                    }&nbsp;{
                        getOrdinal(today.getDate())
                    }
                </p>
                <h1 class="font-[Homemade_Apple] text-6xl sm:text-7xl lg:text-8xl mt-10 mb-20">
                    Good Morning!
                </h1>
            </div>

            <div class="w-full flex flex-col justify-center gap-4 z-10">
                <div class="flex items-start justify-around gap-8">
                    <div class="space-y-4 text-lg sm:text-xl lg:text-2xl">
                        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[0.5rem]">
                            Must Do:
                        </h2>

                        <ul class="list-disc list-inside">
                            {titleSlide()?.mustDos.map(mustDo => (
                                <li>{mustDo}</li>
                            ))}
                        </ul>
                    </div>

                    <div class="space-y-4 text-lg sm:text-xl lg:text-2xl">
                        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[0.5rem]">
                            May Do:
                        </h2>

                        <ul class="list-disc list-inside">
                            {titleSlide()?.mayDos.map(mayDo => (
                                <li>{mayDo}</li>
                            ))}
                        </ul>
                    </div>

                    <img
                        src={titleSlide()?.memeUrl ?? ""}
                        alt="Daily Meme"
                        class="w-auto max-h-80"
                    />
                </div>

                <div class="flex justify-around gap-8">
                    <div class="space-y-4 text-lg sm:text-xl lg:text-2xl">
                        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[0.5rem]">
                            On this day in history:&emsp;&emsp;
                        </h2>

                        <p class="space-y-4 text-2xl sm:text-3xl lg:text-4xl">{titleSlide()?.thisDayInHistory}</p>

                        <hr class="text-blue-700" />

                        <p>&emsp;&emsp;{titleSlide()?.discussion}</p>
                    </div>

                    <div class="space-y-2">
                        <img
                            src="/assets/american_flag.webp"
                            alt="American Flag"
                            class={`${showAmericanFlag() ? "absolute top-0 left-[50%] w-screen h-screen -translate-x-[50%]" : "w-auto max-h-30 mx-auto"} cursor-pointer z-50 transition duration-300 ease-in-out`}
                            onClick={() => setShowAmericanFlag(!showAmericanFlag())}
                        />

                        <img
                            src="/assets/oklahoma_flag.webp"
                            alt="Oklahoma Flag"
                            class={`${showOklahomaFlag() ? "absolute top-0 left-[50%] w-screen h-screen -translate-x-[50%]" : "w-auto max-h-30 mx-auto"} cursor-pointer z-50 transition duration-300 ease-in-out`}
                            onClick={() => setShowOklahomaFlag(!showOklahomaFlag())}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}