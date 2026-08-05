import { Inbox } from "lucide-react";

const Empty = ({ title, subtitle }) => {

    return (

        <div className="py-20 flex flex-col items-center">

            <Inbox size={70} className="text-gray-300" />

            <h2 className="text-2xl font-bold mt-5">
                {title}
            </h2>

            <p className="text-gray-500 mt-2">
                {subtitle}
            </p>

        </div>

    )

}