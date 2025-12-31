function MateriCardSkeleton() {
    return (
        <div className="bg-[#222222] animate-pulse w-full max-w-[455px] rounded-lg p-4 flex gap-4 items-center">
            <div className="bg-[#333333] w-12 h-12 rounded-full"></div>
            <div className="flex-grow space-y-4">
                <div className="flex justify-between items-center">
                    <div className="h-5 w-36 bg-[#333333] rounded-md" />
                    <div className="h-5 w-8 bg-[#333333] rounded-md" />
                </div>
                <div className="h-4 w-full bg-[#333333] rounded-md" />
                <div className="h-2 w-full bg-[#333333] rounded-full"></div>
                <div className="h-4 w-24 bg-[#333333] rounded-md" />
            </div>
        </div>
    );
}

export { MateriCardSkeleton };
