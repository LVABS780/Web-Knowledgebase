import { useAuth } from "@/app/contexts/auth-context";
import { loginAPI, LoginPayload, LoginResponse } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginAPI(payload),
    onSuccess: (data: LoginResponse) => {
      auth.login(data.token, {
        _id: data.user._id,
        role: data.user.role,
        email: data.user.email,
        name: data.user.name,
      });
    },
  });
};
