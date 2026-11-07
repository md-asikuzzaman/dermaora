

export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error("URL is not configured");
  }

  return baseUrl;
};

export async function handleResponse<T>(response: Response): Promise<T> {
  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data;
}
