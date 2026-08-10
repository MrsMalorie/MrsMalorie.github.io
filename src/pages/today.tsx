import { Undo2 } from "lucide-solid";
import LinkButton from "../components/LinkButton";
import { getOrdinal } from "../lib/utils/string";
import SlideController from "../lib/controllers/SlideController";
import { createSignal, onMount } from "solid-js";
import { TitleSlide } from "../lib/types/TitleSlide";

export default function TodayPage() {
    const today = new Date();
    const [titleSlide, setTitleSlide] = createSignal<TitleSlide | null>(null);

    onMount(async () => {
        try {
            setTitleSlide(await SlideController.getTitleSlide());
        } catch (ex) {

        }
    });

    return (
        <main class="bg-gradient-to-b from-blue-300 to-white w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <div class="text-center">
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold">
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

            <div class="w-full flex flex-col">
                <div class="flex items-start justify-around gap-8">
                    <div class="border px-3 py-2 rounded-md bg-white space-y-4 text-lg sm:text-xl lg:text-2xl">
                        <h2 class="border px-3 py-2 rounded-md bg-gray-100 text-4xl sm:text-5xl lg:text-6xl">
                            Must Do
                        </h2>
                    </div>

                    <div class="border px-3 py-2 rounded-md bg-white space-y-4 text-lg sm:text-xl lg:text-2xl">
                        <h2 class="border px-3 py-2 rounded-md bg-gray-100 text-4xl sm:text-5xl lg:text-6xl">
                            May Do
                        </h2>
                    </div>

                    <img
                        src={titleSlide()?.memeUrl ?? ""}
                        alt="Daily Meme"
                        class="w-auto max-h-[50vh]"
                    />
                </div>

                <div>

                </div>
            </div>

            <LinkButton
                href="/"
                label={<div class="flex items-center gap-2">
                    <Undo2 class="w-5 h-5" />
                    Back to Home
                </div>}
                class="mt-8 w-fit mx-auto"
            />
        </main>
    );
}