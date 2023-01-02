import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const useUser = () => {
  const { data, error } = useSWR("/api/auth/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok && router.pathname !== "/auth/enter") {
      router.replace("/create-account");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
};

export default useUser;
