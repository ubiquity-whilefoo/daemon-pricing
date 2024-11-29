import { StaticDecode, Type as T } from "@sinclair/typebox";

export const commandSchema = T.Object({
  name: T.Literal("allow"),
  parameters: T.Object({
    username: T.String(),
    labelTypes: T.Array(T.Union([T.Literal("time"), T.Literal("priority")])),
  }),
});

export type Command = StaticDecode<typeof commandSchema>;
