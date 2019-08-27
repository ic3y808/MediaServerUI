export default class UserService {
  constructor($timeout, $filter, $q) {
    "ngInject";
    this.$timeout = $timeout;
    this.$filter = $filter;
    this.$q = $q;
  }
  GetAll() {
    var deferred = this.$q.defer();
    deferred.resolve(this.getUsers());
    return deferred.promise;
  }

  GetById(id) {
    var deferred = this.$q.defer();
    var filtered = this.$filter("filter")(this.getUsers(), { id: id });
    var user = filtered.length ? filtered[0] : null;
    deferred.resolve(user);
    return deferred.promise;
  }

  GetByUsername(username) {
    var deferred = this.$q.defer();
    var filtered = this.$filter("filter")(this.getUsers(), { username: username });
    var user = filtered.length ? filtered[0] : null;
    deferred.resolve(user);
    return deferred.promise;
  }

  Create(user) {
    var deferred = this.$q.defer();

    // simulate api call with $timeout
    this.$timeout(() => {
      this.GetByUsername(user.username)
        .then((duplicateUser) => {
          if (duplicateUser !== null) {
            deferred.resolve({ success: false, message: "Username \"" + user.username + "\" is already taken" });
          } else {
            var users = this.getUsers();

            // assign id
            var lastUser = users[users.length - 1] || { id: 0 };
            user.id = lastUser.id + 1;

            // save to local storage
            users.push(user);
            this.setUsers(users);

            deferred.resolve({ success: true });
          }
        });
    }, 1000);

    return deferred.promise;
  }

  Update(user) {
    var deferred = this.$q.defer();

    var users = this.getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === user.id) {
        users[i] = user;
        break;
      }
    }
    this.setUsers(users);
    deferred.resolve();

    return deferred.promise;
  }

  Delete(id) {
    var deferred = this.$q.defer();

    var users = this.getUsers();
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if (user.id === id) {
        users.splice(i, 1);
        break;
      }
    }
    this.setUsers(users);
    deferred.resolve();

    return deferred.promise;
  }

  // private functions

  getUsers() {
    if (!localStorage.users) {
      localStorage.users = JSON.stringify([]);
    }

    return JSON.parse(localStorage.users);
  }

  setUsers(users) {
    localStorage.users = JSON.stringify(users);
  }
}