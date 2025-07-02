import Link from "next/link";

export function AllFlagLinkButton() {
  return (
    <div
      className="px-10 self-center text-sm text-primary/80 justify-center
                  flex flex-col items-center space-y-1"
    >
      <div className="bg--500 w-[120px] gap-x-1 flex items-center flex-row">
        <div className="border-t-[1px] border-primary/30 flex-grow" />
        Or explore
        <div className="border-t-[1px] border-primary/30 flex-grow" />
      </div>
      <div className="flex flex-row items-center">
        <Link href={"/all-flags"}>
          <button
            className="py-1 transition-all bg-orange-700/80 hover:bg-orange-800/80 border text-white/80
              dark:bg-[#09080e] dark:hover:bg-[#09080e]/80 dark:border-white/30 px-2 rounded-md shadow-sm shadow-black border-white/50"
          >
            all the flags
          </button>
        </Link>
      </div>
    </div>
  );
}
