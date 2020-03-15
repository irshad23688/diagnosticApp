import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import * as moment from "moment";

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.page.html',
  styleUrls: ['./book-appointment.page.scss']
})
export class BookAppointmentPage implements OnInit {
  bookDate: any;
  timeSlot: any = [];
  selectedEmployee: any = '';
  activeTimeSlot: any = '';
  stylistData: any = [];
  minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substring(0, 10);
  available: any = true;
  maxDate: any = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
  totalDuration: any = 0;

  constructor(private api: RestService, private navCtrl: NavController) {
    this.api.startLoad();
    this.api.get('getSpecialist/' + this.api.dataTransfer).subscribe((res: any) => {
      this.stylistData = res.data;
      this.api.bookingDetails.services.forEach(element => {
        for (let i = 0; i < this.stylistData.length; i++) {
          const el = this.stylistData[i];
          if (el.up == undefined) {
            el.up = 0
          }
          if (element.id == el.specialist) {
            el.up++
          }
        }
      });

      this.stylistData.sort(function (a, b) { return b.up - a.up });
      this.api.dismissLoad();
    }, err => this.api.dismissLoad())
  }

  ngOnInit() { }

  backPage() {
    this.navCtrl.back();
  }

  onChange() {
    if (this.selectedEmployee != '' && this.bookDate != undefined) {
      this.api.startLoad();
      let d = new FormData();
      d.append('employee_id', this.selectedEmployee)
      d.append('date', this.bookDate.substring(0, 10))
      this.api.post('getAvaliableSlot', d).subscribe((res: any) => {
        this.timeSlot = res.data;
        this.api.dismissLoad();
      }, err => {
        this.api.dismissLoad();
      })
    }
  }

  setEmployee(emp) {
    this.selectedEmployee = emp.id;
    this.onChange()
  }

  setTimeSlot(time) {
    this.activeTimeSlot = time;
  }

  continue() {
    let timeZone: any = []
    this.totalDuration = 0;
    if (this.selectedEmployee != '' && this.bookDate != new Date()) {
      let d = new FormData();
      d.append('employee_id', this.selectedEmployee)
      d.append('date', this.bookDate.substring(0, 10))

      // Logic of employee is availible or not 

      this.api.post('getAvaliableSlot', d).subscribe((res: any) => {
        this.api.bookingDetails.services.forEach(element => {
          this.totalDuration += element.duration
        });

        let startTime = moment(this.bookDate.substring(0, 10) + ' ' + this.activeTimeSlot).format('HH:mm')
        let endTime = moment(this.activeTimeSlot, 'hh:mm a').add(this.totalDuration, 'm').format('hh:mm a');
        endTime = moment(this.bookDate.substring(0, 10) + ' ' + endTime).format('HH:mm')

        let start = false;

        for (let i = 0; i < this.timeSlot.length; i++) {
          const element = this.timeSlot[i];
          let check = moment(this.bookDate.substring(0, 10) + ' ' + element.start_time).format('HH:mm')
          if (startTime == check) {
            start = true
          }
          if (start && endTime >= check) {
            timeZone.push(element)
          }
        }
      }, err => this.api.dismissLoad(), () => {
        var checkingTime: any = moment(this.bookDate.substring(0, 10) + ' ' + this.activeTimeSlot).format('HH:mm')
        if (timeZone.length != 0) {

          if (this.totalDuration <= 30 * timeZone.length) {
            for (let i = 0; i < timeZone.length; i++) {
              const element = timeZone[i];

              let check = moment(this.bookDate.substring(0, 10) + ' ' + element.start_time).format('HH:mm')
              if (checkingTime == check) {
                this.available = true;
              }
              else {
                this.available = false;
                break;
              }
              checkingTime = moment(check, 'hh:mm a').add(30, 'm').format('hh:mm a');
              checkingTime = moment(this.bookDate.substring(0, 10) + ' ' + checkingTime).format('HH:mm')
            }
          } else { this.available = false }
        } else { this.available = false }

        if (this.available) {
          if (this.activeTimeSlot != '') {
            this.api.bookingDetails.employee_id = this.selectedEmployee;
            this.api.bookingDetails.time = this.activeTimeSlot;
            this.api.bookingDetails.date = this.bookDate.substring(0, 10);
            this.navCtrl.navigateForward('booking-detail')
          }
          else {
            this.api.error('', 'We Need some service for booking')
          }
        }
        else {
          this.api.error('', 'Employee is not availible for your services')
        }
      })
    }
  }


}
