import useMutation from "@lib/useMutation";
import useUser from "@lib/useUser";
import { useRouter } from "next/router";
import { useState } from "react";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [logout] = useMutation("/api/auth/logout");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const onHomeClick = () => {
    router.push("/");
  };
  const onLogoutClick = () => {
    logout({});
    setLogoutLoading(true);
    setTimeout(() => {
      router.push("/log-in");
    }, 4000);
  };
  return (
    <div className="w-full">
      <header className="fixed top-0 max-w-md w-full z-10 flex justify-between items-center py-4 px-2 bg-red-400">
        <div className="flex-1 cursor-pointer" onClick={onHomeClick}>
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-bold">{title}</span>
        </div>
        <div className="USERINFO flex-1 flex space-x-2 items-center justify-end truncate">
          <span className="font-bold text-sm">{user?.nickname}</span>
          <button
            className="text-xs p-2 border rounded-md hover:bg-black hover:text-white"
            onClick={onLogoutClick}
          >
            LOGOUT
          </button>
        </div>
      </header>
      <div className="py-20">
        {logoutLoading ? <span>Goodbye!... </span> : children}
      </div>
      <footer className="fixed bottom-0 max-w-md w-full z-10"></footer>
    </div>
  );
};
export default Layout;
