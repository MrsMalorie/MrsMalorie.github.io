import { MetaProvider, Title } from "@solidjs/meta";
import FileBadge from "lucide-solid/icons/file-badge";
import Images from "lucide-solid/icons/images";
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
                                href="TODO"
                                target="_blank"
                            >
                                Syllabus
                            </a>
                        </li>
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="TODO"
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
                                href="TODO"
                                target="_blank"
                            >
                                2026-2027
                            </a>
                        </li>
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="TODO"
                                target="_blank"
                            >
                                2025-2026
                            </a>
                        </li>
                        <li>
                            <a
                                class="text-blue-700 hover:underline"
                                href="TODO"
                                target="_blank"
                            >
                                2024-2025
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <LinkButton href="/" label="Back to Home" class="mt-8 w-fit mx-auto" />
        </main>
    );
}