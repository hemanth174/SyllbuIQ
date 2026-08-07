import { TriangleAlert } from "lucide-react";

const ErrorState = ({ retry }) => (

    <div className="text-center py-20">

        <TriangleAlert
            size={60}
            className="text-red-500 mx-auto"
        />

        <h2 className="font-bold text-2xl mt-5">

            Something went wrong

        </h2>

        <button

            onClick={retry}

            className="mt-6 bg-[#1D9E75] text-white px-6 py-3 rounded-xl cursor-pointer"

        >

            Try Again

        </button>

    </div>

)
export default ErrorState