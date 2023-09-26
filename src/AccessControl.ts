import {
  ACCESSORY_API,
  CATEGORIES_API,
  CONSUMABLE_API,
  DEPRECIATIONS_API,
  HARDWARE_API,
  LOCATION_API,
  MANUFACTURES_API,
  TOOLS_API,
  SOFTWARE_API,
  TAX_TOKEN_API,
  CLIENT_HARDWARE_API,
} from "api/baseApi";
import { DEPARTMENT_API, MODELS_API, SUPPLIERS_API } from "api/baseApi";
import i18n from "./i18n";
import { newModel, MemoryAdapter } from "casbin.js";

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const permissions = `
p, 1, ${i18n.t("resource.dashboard")}, list

p, 1, ${i18n.t("resource.assets")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.assets")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.assets-assign")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.assets-assign")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.assets-readyToDeploy")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t(
  "resource.assets-readyToDeploy"
)}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.assets-waiting-confirm")}, list
p, 1, ${i18n.t("resource.assets-waiting-confirm")}/*, (show)|(confirm)|(refuse)

p, 1, ${i18n.t("resource.assets-pending")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.assets-pending")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.assets-broken")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.assets-broken")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.assets-expires")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.assets-expires")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.softwares")}, (list)|(create)
p, 1, ${SOFTWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.softwares")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.licenses")}, (list)|(create)
p, 1, ${i18n.t("resource.licenses")}/*, (edit)|(show)|(checkout)

p, 1, ${i18n.t("resource.request")}, (list)|(create)
p, 1, ${i18n.t("resource.request")}/*, (edit)|(show)|(delete)

p, 1, ${i18n.t("resource.users")}, list
p, 1, ${i18n.t("resource.users")}/*, (show)|(confirm)|(refuse)
p, 1, ${i18n.t("resource.users-tools")}, (list)
p, 1, ${i18n.t("resource.users-tools")}/*, (show)
p, 1, ${i18n.t("resource.users_licenses")}, (list)
p, 1, ${i18n.t("resource.users_licenses")}/*, (show)

p, 1, ${i18n.t("resource.category")}, (list)|(create)
p, 1, ${CATEGORIES_API}/*, (delete)
p, 1, ${i18n.t("resource.category")}/*, (edit)

p, 1, ${i18n.t("resource.manufactures")}, (list)|(create)
p, 1, ${MANUFACTURES_API}/*, (delete)
p, 1, ${i18n.t("resource.manufactures")}/*, (edit)
p, 1, ${i18n.t("resource.manufactures_details")}, (list) 
p, 1, ${i18n.t(
  "resource.manufactures_details"
)}/*, (edit)|(show)|(clone)|(checkout)|(checkin)

p, 1, ${i18n.t("resource.location")}, (list)|(create)
p, 1, ${LOCATION_API}/*, (delete)
p, 1, ${i18n.t("resource.location")}/*, (edit)
p, 1, ${i18n.t("resource.location_details")}, (list) 
p, 1, ${i18n.t(
  "resource.location_details"
)}/*, (edit)|(show)|(clone)|(checkout)|(checkin)

p, 0, ${i18n.t("resource.users")}, (list)
p, 0, ${i18n.t("resource.users")}/*, (show)|(confirm)|(refuse)
p, 0, ${i18n.t("resource.users-tools")}, (list)
p, 0, ${i18n.t("resource.users-tools")}/*, (show)

p, 0, ${i18n.t("resource.users_licenses")}, (list)
p, 0, ${i18n.t("resource.users_licenses")}/*, (show)

p, 1, ${i18n.t("resource.model")}, (list)|(create)
p, 1, ${MODELS_API}/*, (delete)
p, 1, ${i18n.t("resource.model")}/*, (edit)

p, 1, ${i18n.t("resource.suppliers")}, (list)|(create)
p, 1, ${SUPPLIERS_API}/*, (delete)
p, 1, ${i18n.t("resource.suppliers")}/*, (edit)
p, 1, ${i18n.t("resource.supplier_details")}, (list) 
p, 1, ${i18n.t(
  "resource.supplier_details"
)}/*, (edit)|(show)|(clone)|(checkout)|(checkin)


p, 1, ${i18n.t("resource.department")}, (list)|(create)
p, 1, ${DEPARTMENT_API}/*, (delete)
p, 1, ${i18n.t("resource.department")}/*, (edit)

p, 1, ${i18n.t("resource.depreciation")}, (list)|(create)
p, 1, ${DEPRECIATIONS_API}/*, (delete)
p, 1, ${i18n.t("resource.depreciation")}/*, (edit)

p, 1, ${i18n.t("resource.checkin-checkout")}, (list)

p, 1, ${i18n.t("resource.report")}, (list)

p, 1, ${i18n.t("resource.checkin")}, (list)
p, 1, ${i18n.t("resource.checkout")}, (list)

p, 1, ${i18n.t("resource.manager_user")}, (list)|(create)
p, 1, api/v1/users/*, (delete)
p, 1, ${i18n.t("resource.manager_user")}/*, (edit)


p, 1, ${i18n.t("resource.consumables")}, (list)|(create)
p, 1, ${CONSUMABLE_API}/*, (delete)
p, 1, ${i18n.t("resource.consumables")}/*, (edit)|(checkout)|(show)
p, 1, ${i18n.t("resource.consumable_details")}, (list) 
p, 1, ${i18n.t("resource.consumable_details")}/*, (show)

p, 1, ${i18n.t("resource.tax_token")}, (list)|(create)
p, 1, ${i18n.t("resource.tax_token")}/*, (edit)|(checkout)|(show)
p, 1, ${TAX_TOKEN_API}/*, (delete)

p, 1, ${i18n.t("resource.tax_token_waiting")}, (list)

p, 1, ${i18n.t("resource.accessory")}, (list)|(create)
p, 1, ${ACCESSORY_API}/*, (delete)
p, 1, ${i18n.t("resource.accessory")}/*, (edit)|(show)
p, 1, ${i18n.t("resource.accessory_details")}, (list)
p, 1, ${i18n.t("resource.accessory_details")}/*, (show)

p, 1, ${i18n.t("resource.tools-all")}, (list)|(create)
p, 1, ${TOOLS_API}/*, (delete)
p, 1, ${i18n.t("resource.tools-all")}/*, (edit)|(show)|(clone)|(checkout)
p, 1, ${i18n.t("resource.tools-assign")}, (list)|(create)
p, 1, ${TOOLS_API}/*, (delete)
p, 1, ${i18n.t("resource.tools-assign")}/*, (edit)|(show)|(clone)|(checkout)
p, 1, ${i18n.t("resource.tools-waiting")}, (list)

p, 1, ${i18n.t("resource.client-assets")}, (list)|(create)
p, 1, ${CLIENT_HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.client-assets")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.client-asset-assigned")}, (list)|(create)
p, 1, ${CLIENT_HARDWARE_API}/*, (delete)
p, 1, ${i18n.t(
  "resource.client-asset-assigned"
)}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.client-asset-readyToDeploy")}, (list)|(create)
p, 1, ${CLIENT_HARDWARE_API}/*, (delete)
p, 1, ${i18n.t(
  "resource.client-asset-readyToDeploy"
)}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.client-asset-waitingConfirm")}, list
p, 1, ${i18n.t(
  "resource.client-asset-waitingConfirm"
)}/*, (show)|(confirm)|(refuse)

p, 1, ${i18n.t("resource.client-asset-pending")}, (list)|(create)
p, 1, ${CLIENT_HARDWARE_API}/*, (delete)
p, 1, ${i18n.t(
  "resource.client-asset-pending"
)}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.client-asset-broken")}, (list)|(create)
p, 1, ${CLIENT_HARDWARE_API}/*, (delete)
p, 1, ${i18n.t(
  "resource.client-asset-broken"
)}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.client-asset-expires")}, (list)|(create)
p, 1, ${CLIENT_HARDWARE_API}/*, (delete)
p, 1, ${i18n.t(
  "resource.client-asset-expires"
)}/*, (edit)|(show)|(clone)|(checkout)


p, 2, ${i18n.t("resource.dashboard")}, list

p, 2, ${i18n.t("resource.checkin-checkout")}, (list)

p, 2, ${i18n.t("resource.assets")}, (list)
p, 2, ${i18n.t("resource.assets")}/*, (show)

p, 2, ${i18n.t("resource.users")}, list
p, 2, ${i18n.t("resource.users")}/*, (show)|(confirm)|(refuse)
p, 2, ${i18n.t("resource.users-tools")}, (list)
p, 2, ${i18n.t("resource.users-tools")}/*, (show)

p, 2, ${i18n.t("resource.users_licenses")}, (list)
p, 2, ${i18n.t("resource.users_licenses")}/*, (show)

p, 2, ${i18n.t("resource.assets-assign")}, (list)
p, 2, ${i18n.t("resource.assets-assign")}/*,(show)

p, 2, ${i18n.t("resource.assets-readyToDeploy")}, (list)
p, 2, ${i18n.t("resource.assets-readyToDeploy")}/*, (show)

p, 2, ${i18n.t("resource.assets-waiting-confirm")}, list
p, 2, ${i18n.t("resource.assets-waiting-confirm")}/*, (show)

p, 2, ${i18n.t("resource.assets-pending")}, (list)
p, 2, ${i18n.t("resource.assets-pending")}/*, (show)

p, 2, ${i18n.t("resource.assets-broken")}, (list)
p, 2, ${i18n.t("resource.assets-broken")}/*,(show)

p, 2, ${i18n.t("resource.assets-expires")}, (list)
p, 2, ${i18n.t("resource.assets-expires")}/*,(show)

p, 2, ${i18n.t("resource.supplier_details")}, (list) 
p, 2, ${i18n.t("resource.supplier_details")}/*, (show)

p, 2, ${i18n.t("resource.manufactures_details")}, (list) 
p, 2, ${i18n.t("resource.manufactures_details")}/*, (show)

p, 2, ${i18n.t("resource.consumables")}, (list)
p, 2, ${i18n.t("resource.consumables")}/*, (show)
p, 2, ${i18n.t("resource.consumable_details")}, (list) 
p, 2, ${i18n.t("resource.consumable_details")}/*, (show)

p, 2, ${i18n.t("resource.accessory")}, (list)
p, 2, ${i18n.t("resource.accessory")}/*, (show)
p, 2, ${i18n.t("resource.accessory_details")}, (list)
p, 2, ${i18n.t("resource.accessory_details")}/*, (show)

p, 2, ${i18n.t("resource.location_details")}, (list) 
p, 2, ${i18n.t("resource.location_details")}/*,(show)

p, 2, ${i18n.t("resource.report")}, (list)

p, 2, ${i18n.t("resource.client-assets")}, (list)
p, 2, ${i18n.t("resource.client-assets")}/*, (show)

p, 2, ${i18n.t("resource.client-asset-assigned")}, (list)
p, 2, ${i18n.t("resource.client-asset-assigned")}/*,(show)

p, 2, ${i18n.t("resource.client-asset-readyToDeploy")}, (list)
p, 2, ${i18n.t("resource.client-asset-readyToDeploy")}/*, (show)

p, 2, ${i18n.t("resource.client-asset-waitingConfirm")}, list
p, 2, ${i18n.t("resource.client-asset-waitingConfirm")}/*, (show)

p, 2, ${i18n.t("resource.client-asset-pending")}, (list)
p, 2, ${i18n.t("resource.client-asset-pending")}/*, (show)

p, 2, ${i18n.t("resource.client-asset-broken")}, (list)
p, 2, ${i18n.t("resource.client-asset-broken")}/*,(show)

p, 2, ${i18n.t("resource.client-asset-expires")}, (list)
p, 2, ${i18n.t("resource.client-asset-expires")}/*,(show)
`;

export const adapter = new MemoryAdapter(permissions);
