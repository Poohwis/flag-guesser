export function ShowInfoButton({
  showInformation,
  toggleInformation,
}: {
  showInformation: boolean;
  toggleInformation: () => void;
}) {
  return (
    <div className="md:flex hidden flex-row items-center justify-center mt-2 -mb-6 self-end z-10 ">
      <button
        className={`bg-white/20 flex gap-x-1 items-center text-sm text-primary/80 px-2 rounded-full hover:bg-teal-200/20 ${
          showInformation
            ? "outline-1 outline-teal-200 dark:outline-teal-500 "
            : ""
        }`}
        onClick={toggleInformation}
      >
        Show country info
        {showInformation ? (
          <div className="w-3 h-3 dark:bg-teal-500 bg-teal-200 rounded-full" />
        ) : (
          <div className="w-3 h-3 bg-white/40 rounded-full" />
        )}
      </button>
    </div>
  );
}
