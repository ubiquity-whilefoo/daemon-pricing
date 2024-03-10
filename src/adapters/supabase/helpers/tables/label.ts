import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "../../types/database";
import { Super } from "./super";
import { Context } from "../../../../types/context";
import { WebhookEvent } from "../../../../types/github";

type LabelRow = Database["public"]["Tables"]["labels"]["Row"];

export class Label extends Super {
  constructor(supabase: SupabaseClient, context: Context) {
    super(supabase, context);
  }

  async saveLabelChange({
    previousLabel,
    currentLabel,
    authorized,
    repository,
  }: {
    previousLabel: string;
    currentLabel: string;
    authorized: boolean;
    repository: WebhookEvent<"issues">["payload"]["repository"];
  }): Promise<null> {
    const { data, error } = await this.supabase.from("labels").insert({
      label_from: previousLabel,
      label_to: currentLabel,
      authorized: authorized,
      node_id: repository.node_id,
      node_type: "Repository",
      node_url: repository.html_url,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async getLabelChanges(repositoryNodeId: string) {
    const locationId = await this._getRepositoryLocationId(repositoryNodeId);
    if (!locationId) {
      return null;
    }
    return await this._getUnauthorizedLabelChanges(locationId);
  }

  async approveLabelChange(id: number): Promise<null> {
    const { data, error } = await this.supabase.from("labels").update({ authorized: true }).eq("id", id);
    if (error) throw new Error(error.message);
    return data;
  }

  private async _getUnauthorizedLabelChanges(locationId: number): Promise<LabelRow[]> {
    // Get label changes that are not authorized in the repository
    const { data, error } = await this.supabase.from("labels").select("*").eq("location_id", locationId).eq("authorized", false);

    if (error) throw new Error(error.message);

    return data;
  }

  private async _getRepositoryLocationId(nodeId: string) {
    // Get the location_id for the repository from the locations table
    const { data: locationData, error: locationError } = await this.supabase.from("locations").select("id").eq("node_id", nodeId).maybeSingle();

    if (locationError) throw new Error(locationError.message);
    if (!locationData) {
      this.context.logger.error("Repository location ID not found in database.");
      return null;
    }

    return locationData.id;
  }
}
