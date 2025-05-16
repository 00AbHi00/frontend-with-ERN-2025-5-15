import { z } from "zod";

export const UserSchema = z.object({
  userId: z.number(),
  firstName: z.string().min(3,{message:"Atleast 3 characters"}),
  lastName: z.string().min(3,{message:"Atleast 3 characters"}),
  userName: z.string().min(3,{message:"User name must be greater than 3 letters"}), // Required on creation
  userType: z.enum(["system", "admin", "user"], {
    errorMap: () => ({ message: "User type must be one of: system, admin, or user" }),
  }),
});

export const UserUpdateSchema = z.object({
  firstName: z.string().min(3,{message:"Atleast 3 characters"}),
  lastName: z.string().min(3,{message:"Atleast 3 characters"}),
  userName: z.string().min(3,{message:"User name must be greater than 3 letters"}),
  userType: z.enum(["system", "admin", "user"], {
    errorMap: () => ({ message: "User type must be one of: system, admin, or user" }),
  }),
});
