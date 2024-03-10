import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../types/database";
import { GitHubNode } from "../../types/github";
import { Super } from "./super";
import { UserRow } from "./user";
import { Context } from "../../../../types/context";
import { Comment } from "../../../../types/github";

type AccessRow = Database["public"]["Tables"]["access"]["Row"];
type AccessInsert = Database["public"]["Tables"]["access"]["Insert"];
type UserWithAccess = UserRow & { access: AccessRow[] };

type AccessData = {
  user_id: number;
  multiplier: number;
  multiplier_reason: string;
  node_id: string;
  node_type: string;
  node_url: string;
};

export class Access extends Super {
  constructor(supabase: SupabaseClient, context: Context) {
    super(supabase, context);
  }

  private async _getUserWithAccess(id: number): Promise<UserWithAccess> {
    const { data, error } = await this.supabase.from("users").select("*, access(*)").filter("id", "eq", id).single();

    if (error) {
      this.context.logger.fatal(error.message, error);
      throw new Error(error.message);
    }
    return data;
  }

  public async getAccess(id: number): Promise<AccessRow | null> {
    const userWithAccess = await this._getUserWithAccess(id);
    if (userWithAccess.access.length === 0) {
      this.context.logger.debug("No access found for user", { id });
      return null;
    }
    return userWithAccess.access[0];
  }

  public async setAccess(labels: string[], node: GitHubNode, userId?: number): Promise<null> {
    const { data, error } = await this.supabase.from("access").upsert({
      labels: labels,
      ...node,
      user_id: userId,
    } as AccessInsert);
    if (error) throw new Error(error.message);
    return data;
  }

  async upsertMultiplier(userId: number, multiplier: number, reason: string, comment: Comment) {
    try {
      const accessData: AccessData = {
        user_id: userId,
        multiplier: multiplier,
        multiplier_reason: reason,
        node_id: comment.node_id,
        node_type: "IssueComment",
        node_url: comment.html_url,
      };

      const { data, error } = await this.supabase.from("access").upsert(accessData, { onConflict: "location_id" });

      if (error) throw new Error(error.message);
      if (!data) throw new Error("Multiplier not upserted");
    } catch (error) {
      console.error("An error occurred while upserting multiplier:", error);
    }
  }
}
