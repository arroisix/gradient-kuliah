const QuestionCard = (): JSX.Element => {
    return (
        <div className="w-full border-[1px] border-neutral-800 rounded-xl">
            <div>profile</div>
            <div>pertanayan</div>
            <div>
                <div>
                    <div>mata</div>
                    <div>komen</div>
                </div>
                <button className="bg-accent-purple">Jawab</button>
            </div>
        </div>
    );
};

export default QuestionCard;
