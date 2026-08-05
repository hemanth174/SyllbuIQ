import { Loader2 } from "lucide-react";

const Loading = ({ text }) => {
    return (
        <div className="flex flex-col justify-center items-center py-60">

            <Loader2
                size={45}
                className="animate-spin text-[#1D9E75]"
            />

            <p className="mt-4 text-gray-500">
                {text}
            </p>

        </div>
    );
};

export default Loading;