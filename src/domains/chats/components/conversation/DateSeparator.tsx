import {formatDateSeparator} from "@/lib/utils.ts";

export const DateSeparator = ({ timestamp }: { timestamp: number }) => (
    <div className="flex items-center justify-center my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-xs text-gray-500 bg-white">
      {formatDateSeparator(timestamp)}
    </span>
        <div className="flex-1 h-px bg-gray-200" />
    </div>
);
