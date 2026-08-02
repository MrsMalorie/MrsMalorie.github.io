import { MetaProvider, Title } from "@solidjs/meta";
import FileBadge from "lucide-solid/icons/file-badge";
import Images from "lucide-solid/icons/images";
import Undo2 from "lucide-solid/icons/undo-2";
import LinkButton from "~/components/LinkButton";

export default function ResourcesPage() {
    return (
        <main class="bg-gradient-to-b from-blue-300 to-white min-h-screen px-8 py-16">
            <MetaProvider>
                <Title>Resources</Title>
            </MetaProvider>

            <div class="bg-white/80 rounded-lg shadow-lg p-8 flex flex-col gap-8">
                <div class="space-y-2">
                    <h1 class="font-[Bitter] font-bold text-3xl">
                        Class Resources
                    </h1>
                    <hr />
                </div>

                <div class="space-y-4">
                    <div class="flex items-end gap-2">
                        <FileBadge class="w-8 h-8" />

                        <h2 class="font-[Bitter] font-bold text-xl">
                            Overview
                        </h2>
                    </div>

                    <ul class="list-disc list-inside space-y-1">
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="https://docs.google.com/document/d/1Z8cldMdo8FyFeRJ3FJu6kpttNEVw7RopZh9MEFaulUE/edit?usp=sharing"
                                target="_blank"
                            >
                                Syllabus
                            </a>
                        </li>
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="https://docs.google.com/spreadsheets/d/1780OpdxnXW67WAyYE0tLpRkWLyFH88W75pzlgfKGTBw/edit?usp=sharing"
                                target="_blank"
                            >
                                Course Schedule
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="space-y-4">
                    <div class="flex items-end gap-2">
                        <Images class="w-8 h-8" />

                        <h2 class="font-[Bitter] font-bold text-xl">
                            Class Photos
                        </h2>
                    </div>

                    <ul class="list-disc list-inside space-y-1">
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="https://drive.google.com/drive/folders/1r6TTGQgiK54NQYbmOgfDhQLNmtIIva02?usp=sharing"
                                target="_blank"
                            >
                                2026-2027
                            </a>
                        </li>
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="https://drive.google.com/drive/folders/1ZROMGF4_GTKNafSe1rGrLr1Mn3LGcC1I?usp=sharing"
                                target="_blank"
                            >
                                2025-2026
                            </a>
                        </li>
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="https://drive.google.com/drive/folders/1O_Fu3jWiJqAfs6p2qLalk9nwNWH11aim?usp=sharing"
                                target="_blank"
                            >
                                2024-2025
                            </a>
                        </li>
                    </ul>
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