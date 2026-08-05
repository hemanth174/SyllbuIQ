import { CheckCircle2 } from "lucide-react";

const SuccessToast = ({ message }) => (

    <div className="trasition-all duration-300 fixed right-6 top-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">

        <CheckCircle2 />

        {message}

    </div>

)
export default SuccessToast