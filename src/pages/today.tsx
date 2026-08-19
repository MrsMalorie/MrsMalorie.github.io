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
            console.error("Failed to fetch title slide:", ex);
        }
    });

    return (
        <main class="bg-gradient-to-b from-blue-300 to-white w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden gap-12">
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
                <p class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.25rem]">
                    {
                        today.toLocaleString('en-US', { month: 'long' })
                    }&nbsp;{
                        getOrdinal(today.getDate())
                    }
                </p>
                <h1 class="font-[Homemade_Apple] text-4xl sm:text-5xl lg:text-6xl mt-10">
                    Good Morning!
                </h1>
            </div>

            <div class="w-full flex flex-col justify-center gap-8 z-10">
                <div class="flex items-start justify-around gap-8">
                    <div class="space-y-4 text-md sm:text-lg lg:text-xl">
                        <h2 class="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[0.25rem]">
                            Must Do:
                        </h2>

                        <ul class="list-disc list-inside">
                            {titleSlide()?.mustDos.map(mustDo => (
                                <li>{mustDo}</li>
                            ))}
                        </ul>
                    </div>

                    <div class="space-y-4 text-md sm:text-lg lg:text-xl">
                        <h2 class="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[0.25rem]">
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
                    <div class="space-y-4 text-md sm:text-lg lg:text-xl">
                        <h2 class="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[0.25rem]">
                            On this day in history:&emsp;&emsp;
                        </h2>

                        <p class="space-y-4 text-lg sm:text-xl lg:text-2xl">{titleSlide()?.thisDayInHistory}</p>

                        <hr class="text-blue-700" />

                        <p>&emsp;&emsp;{titleSlide()?.discussion}</p>
                    </div>

                    <div class="space-y-2">
                        <img
                            src="/assets/american_flag.webp"
                            alt="American Flag"
                            class={`${showAmericanFlag() ? "absolute top-0 left-[50%] h-screen -translate-x-[50%]" : "max-h-30 mx-auto"} w-auto cursor-pointer z-50 transition duration-300 ease-in-out`}
                            onClick={() => {
                                setShowAmericanFlag(!showAmericanFlag());
                                setShowOklahomaFlag(false);
                            }}
                        />

                        <img
                            src="/assets/oklahoma_flag.webp"
                            alt="Oklahoma Flag"
                            class={`${showOklahomaFlag() ? "absolute top-0 left-[50%] h-screen -translate-x-[50%]" : "max-h-30 mx-auto"} w-auto cursor-pointer z-50 transition duration-300 ease-in-out`}
                            onClick={() => {
                                setShowAmericanFlag(false);
                                setShowOklahomaFlag(!showOklahomaFlag());
                            }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}