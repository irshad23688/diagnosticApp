import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { 
        path: 'home',
        children: [
          {
            path: '',
            // loadChildren: '../pages/home/home.module#HomePageModule'
          }
        ]
      },
      {
        path: 'nearBy',
        children: [
          {
            path: '',
            loadChildren: '../pages/near-by/near-by.module#NearByPageModule'
          }
        ]
      },
      {
        path: 'appoinment',
        children: [
          {
            path: '',
            loadChildren:
              '../pages/appoinments-list/appoinments-list.module#AppoinmentsListPageModule'
          }
        ]
      },
      {
        path: 'notification',
        children: [
          {
            path: '',
            loadChildren:
              '../pages/notification/notification.module#NotificationPageModule'
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: '../pages/profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/nearBy',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/nearBy',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
