import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/MainServices/User.service';
import { HomePostsService } from '../home-page/HomeServices/home-posts.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";
  counter: number = 0;
  notificationsCount: BehaviorSubject<number>;
  public isCollapsed = false;
  Notifications: any[] = [];
  uid;
  avatar;
  data: Observable<any>;
  subscription: Subscription[] = [];
  constructor(private homePostServ: HomePostsService, private us: UserService) {
    this.notificationsCount = new BehaviorSubject<number>(5);
    this.data = this.us.localUserData.asObservable();
    let sub = this.data.subscribe((res) => {
      if (res != null) {
        this.uid = res.id;
        this.avatar = res.avatar;
      }
    });
    this.subscription.push(sub);
  }

  ngOnInit(): void {
    this.homePostServ.getAllNotifications(this.uid).subscribe((data) => {
      this.Notifications = data.map((e) => {
        return {
          id: e.payload.doc.id,
          data: e.payload.doc.data(),
          doc:e.payload.doc
        };
      });
    });
  }

  onScrollDown () { 
    this.counter += 5;
    let param = this.Notifications[this.Notifications.length - 1].doc;
    this.homePostServ.getAllNotifications(this.uid,param )
      .subscribe((res) => {
        res.map((e) => {
          this.Notifications.push({
            id: e.payload.doc.id,
            data: e.payload.doc.data(),
            doc:e.payload.doc
          });
        });
       
      });

    this.notificationsCount.next(this.notificationsCount.value + 5);
 
}
  DeleteNotification(postid) {
    this.homePostServ.DeleteNotification(postid, this.uid);
  }
}
