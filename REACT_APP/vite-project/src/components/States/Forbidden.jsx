import { Lock } from "lucide-react";

const Forbidden = () => (

    <div className="text-center py-24">

        <Lock
            size={60}
            className="mx-auto text-red-500"
        />

        <h1 className="text-3xl font-bold mt-6">

            Access Denied

        </h1>

        <p className="text-gray-500">

            You don't have permission.

        </p>

    </div>

)