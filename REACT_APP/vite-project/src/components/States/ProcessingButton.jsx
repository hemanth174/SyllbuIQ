import { Loader2 } from "lucide-react";

const ProcessingButton = ({
    loading,
    children
}) => (

    <button

        disabled={loading}

        className="bg-[#1D9E75] text-white px-6 py-3 rounded-xl disabled:opacity-60"

    >

        {

            loading ?

                <div className="flex items-center gap-2">

                    <Loader2
                        size={18}
                        className="animate-spin"
                    />

                    Processing...

                </div>

                :

                children

        }

    </button>

)