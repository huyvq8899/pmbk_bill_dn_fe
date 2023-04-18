export function bkdecodeKT(tokenKey: string) {
    // tăng ký tự 1,6,8 lên 1
    const a = tokenKey.charAt(50);
    const b = tokenKey.charAt(51);
    const c = tokenKey.charAt(52);
    const d = tokenKey.charAt(63);
    const e = tokenKey.charAt(65);
    const f = tokenKey.charAt(68);
    const g = tokenKey.charAt(73);
    const h = tokenKey.charAt(81);

    const ea = String.fromCharCode(a.charCodeAt(0) - 1);
    const eb = String.fromCharCode(b.charCodeAt(0) - 1);
    const ec = String.fromCharCode(c.charCodeAt(0) - 1);
    const ed = String.fromCharCode(d.charCodeAt(0) - 1);
    const ee = String.fromCharCode(e.charCodeAt(0) - 1);
    const ef = String.fromCharCode(f.charCodeAt(0) - 1);
    const eg = String.fromCharCode(g.charCodeAt(0) - 1);
    const eh = String.fromCharCode(h.charCodeAt(0) - 1);

    tokenKey = tokenKey.substr(0, 50) + ea + tokenKey.substr(50 + 1);
    tokenKey = tokenKey.substr(0, 51) + eb + tokenKey.substr(51 + 1);
    tokenKey = tokenKey.substr(0, 52) + ec + tokenKey.substr(52 + 1);
    tokenKey = tokenKey.substr(0, 63) + ed + tokenKey.substr(63 + 1);
    tokenKey = tokenKey.substr(0, 65) + ee + tokenKey.substr(65 + 1);
    tokenKey = tokenKey.substr(0, 68) + ef + tokenKey.substr(68 + 1);
    tokenKey = tokenKey.substr(0, 73) + eg + tokenKey.substr(73 + 1);
    tokenKey = tokenKey.substr(0, 81) + eh + tokenKey.substr(81 + 1);
    return tokenKey;
}