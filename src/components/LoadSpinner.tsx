export default function LoadSpinner() {
    return (
        <div class="flex items-center mx-auto w-fit">
            <div class="animate-spin size-4 border-2 border-current mr-2 border-t-transparent rounded-full"></div>
            <p class="text-lg">Loading...</p>
        </div>
    );
}