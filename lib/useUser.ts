import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserResponse {
  ok: boolean;
  profile: User;
}

const useUser = () => {
  const { data, error } = useSWR<UserResponse>("/api/auth/me");
  const router = useRouter();
  useEffect(() => {
    if (
      data &&
      !data.ok &&
      !(router.pathname === "/log-in" || router.pathname === "/create-account")
    ) {
      router.replace("/log-in");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
};

export default useUser;
