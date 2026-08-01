import { MetaProvider, Title } from "@solidjs/meta";

export default function TodayPage() {
    return (
        <main>
            <MetaProvider>
                <Title>In Class Today</Title>
            </MetaProvider>
        </main>
    );
}