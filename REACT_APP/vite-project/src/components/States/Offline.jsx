import { WifiOff } from "lucide-react";

const Offline = () => (

    <div className="text-center py-20">

        <WifiOff
            size={60}
            className="mx-auto text-red-400"
        />

        <h2 className="mt-5 text-2xl font-bold">

            No Internet

        </h2>

        <p className="text-gray-500">

            Reconnect and refresh.

        </p>

    </div>

)