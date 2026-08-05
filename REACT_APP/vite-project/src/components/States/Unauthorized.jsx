import { ShieldX } from "lucide-react";

const Unauthorized = () => (

    <div className="text-center py-24">

        <ShieldX
            size={60}
            className="mx-auto text-yellow-500"
        />

        <h1 className="text-3xl font-bold mt-6">

            Login Required

        </h1>

        <p className="text-gray-500 mt-3">

            Please login to continue.

        </p>

    </div>

)