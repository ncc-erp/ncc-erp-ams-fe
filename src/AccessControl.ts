import { newModel, MemoryAdapter } from "casbin.js";
import i18n from "i18n";

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

export const adapter = new MemoryAdapter(`
p, admin, dashboard, list

p, admin, assets, (list)|(create)
p, admin, api/v1/hardware/*, (delete)
p, admin, assets/*, (edit)|(show)|(clone)|(checkout)

p, admin, Tạo request, (list)|(create)
p, admin, Tạo request/*, (edit)|(show)|(delete)

p, admin, Tài sản của tôi, list
p, admin, Tài sản của tôi/*, (show)|(confirm)|(refuse)

p, user, dashboard, list
p, user, Tài sản của tôi, (list)
p, user, Tài sản của tôi/*, (show)|(confirm)|(refuse)

`);
