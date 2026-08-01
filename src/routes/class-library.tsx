import { MetaProvider, Title } from "@solidjs/meta";

export default function ClassLibraryPage() {
    return (
        <main>
            <MetaProvider>
                <Title>Class Library</Title>
            </MetaProvider>
        </main>
    );
}