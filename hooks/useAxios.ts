import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from 'axios';
import { useCallback, useEffect, useState } from 'react';

type UseAxiosParams = {
  axiosInstance?: AxiosInstance;
  axiosParams?: AxiosRequestConfig;
  axiosRequest?: () => Promise<AxiosResponse>;
  fetchOnMount?: boolean;
};

export default function useAxios<T>({
  axiosInstance,
  axiosParams,
  axiosRequest,
  fetchOnMount = true,
}: UseAxiosParams) {
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (params?: AxiosRequestConfig) => {
      try {
        const result = await (axiosRequest?.() ||
          (axiosInstance || axios).request<T>(params ?? {}));
        setResponse(result);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance, axiosRequest],
  );

  useEffect(() => {
    if (fetchOnMount) fetchData(axiosParams);
  }, [fetchData, axiosParams, fetchOnMount]);

  return { response, error, loading, fetchData };
}
