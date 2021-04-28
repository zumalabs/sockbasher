import getHash from "object-hash";

// we might use something else, so that's why there's a whole module here
export default (d: any) => getHash(d);
