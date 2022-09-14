import { Store } from "pullstate";

const AuthStore = new Store({ user: null, token: null });

export default AuthStore;
