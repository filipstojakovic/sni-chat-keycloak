import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {


  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.authServer + "/admin/realms/my-realm/users")
      .pipe(map(users => users.map(user => new User(user.username, user.firstName, user.lastName))),
      );
  }
}
