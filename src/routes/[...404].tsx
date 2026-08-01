export default function NotFound() {
  return (
    <main class="bg-gradient-to-b from-blue-300 to-white w-screen h-screen flex items-center justify-center">
        <div class="bg-white/80 rounded-lg p-8 shadow-lg">
            <h1 class="font-[Bitter] font-bold text-xl">
                404 - Page Not Found
            </h1>
            <p class="mt-2 text-gray-700">
                The link provided did not resolve to a valid webpage. Please return <a href="/" class="text-blue-700 hover:underline">home</a>.
            </p>
        </div>
    </main>
  );
}
