import { Component, OnInit } from '@angular/core';
import { ChecksListUserDTO, ChosenOneDTO } from '../../dtos/chosenOneDTO';
import { ChecklistService } from '../../services/checklist.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent implements OnInit {
  ordersData: ChosenOneDTO | null = null;
  errorMessage: string | null = null;

  constructor(private chesklistService: ChecklistService, private http: HttpClient) { }

  ngOnInit(): void {
    this.chesklistService.getTodayOrders()
      .subscribe({
        next: (data) => this.ordersData = data,
        error: (error) => this.errorMessage = error.message
      });
  }

  calculateUserTotal(user: ChecksListUserDTO): number {
    return user.priceForOrder;
  }

  calculateGrandTotal(): number {
    if (!this.ordersData) {
      return 0;
    }
    return this.ordersData.users.reduce((acc, user) => acc + user.priceForOrder, 0);
  }

  togglePaid(user: ChecksListUserDTO, event: any) {
    if (event.target.checked) {
      this.chesklistService.markOrderAsPaid(user.id).subscribe(
        (success) => {
          user.paid = true;
        },
        (error) => {
          console.error('Error marking order as paid:', error);
        }
      );
    } else {
      user.paid = false;
    }
  }

  calculatePaidTotal(): number {
    let paidTotal = 0;

    if (this.ordersData && this.ordersData.users) {
      paidTotal = this.ordersData.users
        .filter(user => user.paid)
        .reduce((total, user) => total + user.priceForOrder, 0);
    }
    return paidTotal;
  }
}

