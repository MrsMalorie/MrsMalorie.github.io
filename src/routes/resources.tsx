import { MetaProvider, Title } from "@solidjs/meta";

export default function ResourcesPage() {
    return (
        <main>
            <MetaProvider>
                <Title>Resources</Title>
            </MetaProvider>
        </main>
    );
}