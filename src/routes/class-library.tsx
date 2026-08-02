import { MetaProvider, Title } from "@solidjs/meta";

export default function ClassLibraryPage() {
    return (
        <main class="bg-gradient-to-b from-blue-300 to-white min-h-screen px-4 sm:px-8">
            <MetaProvider>
                <Title>Class Library</Title>
            </MetaProvider>

            <div class="min-h-screen striped-background border-x-20 border-x-[#d7a350] bg-blend-overlay bg-white/80 px-4 sm:px-8 py-16 flex flex-col gap-4">
                <div class="space-y-2">
                    <h1 class="font-[Bitter] font-bold text-3xl">Search the Class Library</h1>
                    <hr />
                </div>

                <div>

                </div>

                <table class="w-full">
                    <tbody>

                    </tbody>
                </table>
            </div>
        </main>
    );
}