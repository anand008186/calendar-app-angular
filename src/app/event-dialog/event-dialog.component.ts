import { CommonModule } from '@angular/common';
import { Component, Inject,  } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Event } from "../shared/events/event.model";
@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule


  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent  {
  eventForm!: FormGroup;
  times: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event
  ) {
    this.eventForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      date: [data?.date || '', Validators.required],
      time: [data?.time || '',]
    });

    for (let i = 0; i < 24; i++) {
          const hour = i % 12 === 0 ? 12 : i % 12;
          const period = i < 12 ? 'AM' : 'PM';
          this.times.push(`${hour}:00 ${period}`);
        }

        if (this.data) {
              this.eventForm.patchValue({
                title: this.data.title || '',
                time: this.data.time || '',
                date: this.data.date || new Date()
              });
            }
  }

  onSave(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close({ action: 'save', event: this.eventForm.value });
    }
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', event: this.data });
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}