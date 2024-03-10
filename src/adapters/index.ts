import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "../types/context";
import { Access } from "./supabase/helpers/tables/access";
import { User } from "./supabase/helpers/tables/user";
import { Label } from "./supabase/helpers/tables/label";
import { Locations } from "./supabase/helpers/tables/locations";
import { Super } from "./supabase/helpers/tables/super";

export function createAdapters(supabaseClient: SupabaseClient, context: Context) {
  return {
    supabase: {
      access: new Access(supabaseClient, context),
      user: new User(supabaseClient, context),
      label: new Label(supabaseClient, context),
      locations: new Locations(supabaseClient, context),
      super: new Super(supabaseClient, context),
    },
  };
}
