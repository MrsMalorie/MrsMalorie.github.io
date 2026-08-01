export default function NotFound() {
  return (
    <main class="bg-gradient-to-b from-blue-300 to-white w-screen h-screen flex flex-col items-center justify-center">
        <div class="bg-white rounded-lg p-8 shadow-lg z-5 relative">
            <h1 class="font-[Bitter] font-bold text-xl">
                404 - Page Not Found
            </h1>
            <p class="mt-2 text-gray-700">
                Clearly, you aren't supposed to be here... Just go <a href="/" class="text-blue-700 hover:underline">home</a> already.
            </p>

            <img src="/assets/404_bros.webp" class="absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-100%] w-80" />
        </div>
    </main>
  );
}
