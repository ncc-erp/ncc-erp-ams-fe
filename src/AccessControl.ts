import { CATEGORIES_API, HARDWARE_API, LOCATION_API, MANUFACTURES_API } from "api/baseApi";
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
`;

export const adapter = new MemoryAdapter(permissions);
