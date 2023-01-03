//a kind of react component
import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

const useMutation = <T extends {}>(url: string): UseMutationResult<T> => {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  const mutation = (data: any) => {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) =>
        response.json().catch(() => {
          console.log("NO data from Server.");
        })
      )
      .then((data) => setState((prev) => ({ ...prev, data, loading: false })))
      .catch((error) =>
        setState((prev) => ({ ...prev, error, loading: false }))
      );
  };
  return [mutation, { ...state }];
};
export default useMutation;
