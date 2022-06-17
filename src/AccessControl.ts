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

export const adapter = new MemoryAdapter(`
p, 1, dashboard, list

p, 1, assets, (list)|(create)
p, 1, api/v1/hardware/*, (delete)
p, 1, assets/*, (edit)|(show)|(clone)|(checkout)

p, 1, Tạo request, (list)|(create)
p, 1, Tạo request/*, (edit)|(show)|(delete)

p, 1, Tài sản của tôi, list
p, 1, Tài sản của tôi/*, (show)|(confirm)|(refuse)

p, 0, dashboard, list
p, 0, Tài sản của tôi, (list)
p, 0, Tài sản của tôi/*, (show)|(confirm)|(refuse)

`);
