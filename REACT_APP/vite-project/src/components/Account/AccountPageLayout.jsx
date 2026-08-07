const AccountPageLayout = ({ title, actions, children }) => (
    <div className="mx-auto w-full max-w-8xl space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
        {children}
    </div>
);

export default AccountPageLayout;
