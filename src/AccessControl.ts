import {
  CATEGORIES_API,
  DEPRECIATIONS_API,
  HARDWARE_API,
  LOCATION_API,
  MANUFACTURES_API,
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
p, 1, ${i18n.t("resource.assets-readyToDeploy")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.assets-pending")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.assets-pending")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.assets-broken")}, (list)|(create)
p, 1, ${HARDWARE_API}/*, (delete)
p, 1, ${i18n.t("resource.assets-broken")}/*, (edit)|(show)|(clone)|(checkout)

p, 1, ${i18n.t("resource.request")}, (list)|(create)
p, 1, ${i18n.t("resource.request")}/*, (edit)|(show)|(delete)

p, 1, ${i18n.t("resource.users")}, list
p, 1, ${i18n.t("resource.users")}/*, (show)|(confirm)|(refuse)

p, 1, ${i18n.t("resource.category")}, (list)|(create)
p, 1, ${CATEGORIES_API}/*, (delete)
p, 1, ${i18n.t("resource.category")}/*, (edit)

p, 1, ${i18n.t("resource.manufactures")}, (list)|(create)
p, 1, ${MANUFACTURES_API}/*, (delete)
p, 1, ${i18n.t("resource.manufactures")}/*, (edit)

p, 1, ${i18n.t("resource.location")}, (list)|(create)
p, 1, ${LOCATION_API}/*, (delete)
p, 1, ${i18n.t("resource.location")}/*, (edit)

p, 0, ${i18n.t("resource.dashboard")}, list
p, 0, ${i18n.t("resource.users")}, (list)
p, 0, ${i18n.t("resource.users")}/*, (show)|(confirm)|(refuse)

p, 1, ${i18n.t("resource.model")}, (list)|(create)
p, 1, ${MODELS_API}/*, (delete)
p, 1, ${i18n.t("resource.model")}/*, (edit)

p, 1, ${i18n.t("resource.suppliers")}, (list)|(create)
p, 1, ${SUPPLIERS_API}/*, (delete)
p, 1, ${i18n.t("resource.suppliers")}/*, (edit)

p, 1, ${i18n.t("resource.department")}, (list)|(create)
p, 1, ${DEPARTMENT_API}/*, (delete)
p, 1, ${i18n.t("resource.department")}/*, (edit)

p, 1, ${i18n.t("resource.depreciation")}, (list)|(create)
p, 1, ${DEPRECIATIONS_API}/*, (delete)
p, 1, ${i18n.t("resource.depreciation")}/*, (edit)

p, 1, ${i18n.t("resource.assets_refuse")}, (list)
`;

export const adapter = new MemoryAdapter(permissions);