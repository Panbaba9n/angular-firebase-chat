import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from "./shared/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user = null;
  itemsRef: any;
  items: AngularFireList<any>;
  name: any;
  msgVal: string = '';

  constructor(
    private auth: AngularFireAuth,
    private authService: AuthService,
    private afDb: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.itemsRef = this.afDb.list('/messages', (ref) => ref.limitToLast(5));
    // todo: it goes, but I don't like it
    // this.items = this.itemsOservable.snapshotChanges();
    this.items = this.itemsRef.valueChanges();

    this.authService.getAuthState().subscribe(
      (user) => this.user = user
    );
  }

  loginWithFacebook(): void {
    this.authService.loginWithFacebook();
    this.user = this.authService.getCurrentUser();
    console.log('this.user', this.user);
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
    this.user = this.authService.getCurrentUser();
    console.log('this.user', this.user);
  }

  // emailSignUp(): void {
  //   this.authService.emailSignUp({email: 'User Name', password: 'Wonderful'});
  //   this.user = this.authService.getCurrentUser();
  //   console.log('this.user is logined by emailSignUp', this.user);
  // }

  logout(): void {
    this.authService.logout();
    this.user = this.authService.getCurrentUser();
    console.log('this.user', this.user);
  }

  chatSend(theirMessage: string): void {
    if (this.user && theirMessage.trim().length > 0) {
      this.itemsRef.push({ message: theirMessage.trim(), name: this.user.displayName});
      this.msgVal = '';
    }
  }

  log(mesage): void {
    console.log(mesage);
  }
}
