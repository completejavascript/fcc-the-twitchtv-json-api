class AppStorage {
  constructor(type) {
    if (this._storageAvailable(type)) {
      this._appStorage = window[type];
    } else {
      console.log('app-storage', `Your browser doesn't support ${type}!`);
    }
  }
  set(key, value) {
    if (this._appStorage) {
      this._appStorage.setItem(key, value);
    }
  }
  get(key) {
    if (this._appStorage) {
      return this._appStorage.getItem(key);
    }
  }
  remove(key) {
    if (this._appStorage) {
      this._appStorage.removeItem(key); 
    }
  }
  _storageAvailable(type) {
    try {
      let storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch (e) {
      console.log('app-storage', e);
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
  }
}
