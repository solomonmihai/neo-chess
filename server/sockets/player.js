export default class Player {
  constructor ({ userId, socket }) {
    this.userId = userId;
    this.socket = socket;
    this.disconnected = false;
  }
}
