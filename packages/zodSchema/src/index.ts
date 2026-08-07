import z from "zod";

export const SignUpSchema = z.object({
  username: z.string().nonempty("Required"),
  password: z.string().nonempty("Required"),
  avatarId: z.string().nonempty("Required"),
  role: z.enum(["Admin", "User"]),
});

export const SignInSchema = z.object({
  username: z.string().nonempty("Required"),
  password: z.string().nonempty("Required"),
});
