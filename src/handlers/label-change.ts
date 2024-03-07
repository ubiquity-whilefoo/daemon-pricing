import { isUserAdminOrBillingManager } from "../shared/issue";
import { Context } from "../types/context";

export async function watchLabelChange(context: Context) {
  const logger = context.logger;

  const payload = context.payload;
  if (!("changes" in payload) || !payload.changes) {
    context.logger.debug("Not an issue event");
    return;
  }
  const { label, changes, sender } = payload;

  const previousLabel = changes?.name?.from;
  if (!previousLabel) {
    throw logger.error("previous label name is undefined");
  }
  const currentLabel = label?.name;
  const triggerUser = sender.login;

  if (!previousLabel || !currentLabel) {
    return logger.debug("No label name change.. skipping");
  }

  // check if user is authorized to make the change
  const hasAccess = await hasLabelEditPermission(context, currentLabel, triggerUser);

  const { supabase } = Runtime.getState().adapters;

  await supabase.label.saveLabelChange({
    previousLabel,
    currentLabel,
    authorized: hasAccess,
    repository: payload.repository,
  });
  return logger.debug("label name change saved to db");
}

async function hasLabelEditPermission(context: Context, label: string, caller: string) {
  const logger = context.logger;
  const sufficientPrivileges = await isUserAdminOrBillingManager(context, caller);

  // get text before :
  const match = label.split(":");
  if (match.length == 0) return false;

  if (sufficientPrivileges) {
    // check permission
    const { access, user } = Runtime.getState().adapters.supabase;
    const userId = await user.getUserId(context.event, caller);
    const accessible = await access.getAccess(userId);
    if (accessible) return true;
    logger.info("No access to edit label", { caller, label });
    return false;
  }

  return true;
}
