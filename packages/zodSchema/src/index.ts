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

export const UpdateUserMetadata = z.object({
  avatarId:z.string()
})

export const CreateSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string(),
});

export const AddElementSchema = z.object({
  spaceId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const createElementSchema = z.object({
  imageUrl: z.string(),
  width: z.string(),
  height: z.string(),
  static: true,
});

export const UpdateElementSchema = z.object({
  imageUrl: z.string(),
});

export const CreateAvatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
});

export const CreateMapSchema = z.object({
  thumbnail: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  ),
});
