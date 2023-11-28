import { KeyValuePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormArray, FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { first, forkJoin } from 'rxjs';
import { Controls } from '../../../share/utils/controls';
import { TCreatePoll, TPoll } from '../../../types';
import { PollService } from '../services/poll.service';
import { SentimentService } from '../services/sentiment.service';
import { GetMoodIcon } from './mood-icon.pipe';
import { GetMoodStyle } from './mood-style.pipe';

@Component({
  selector: 'app-newjob',
  templateUrl: './newjob.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, KeyValuePipe, GetMoodStyle, GetMoodIcon]
})
export default class NewjobComponent {
  @Output() pollCreated = new EventEmitter();

  readonly $sentiments = signal([] as number[]);
  private readonly pollService = inject(PollService);
  private readonly sentimentsService = inject(SentimentService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly pollForm = this.fb.group<Controls<TCreatePoll>>({
    question: this.fb.control('Tell me more about your mood?', [Validators.required]),
    options: this.fb.array(['I\'m a winner forever!', 'Death spreads around me every second', 'I don\'t know actually'], [Validators.required]),
    description: this.fb.control('I wanna ask my subscribers about yours mood. Select the best options below!', [Validators.required]),
    thumbnail: this.fb.control('https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
  });

  readonly newOption = this.fb.control('', [Validators.required]);

  get options(): FormArray<FormControl<string>> {
    return this.pollForm.controls.options as FormArray<FormControl<string>>;
  }

  calculateSentiments() {
    const options = this.pollForm.value.options as string[];

    const results$ = options.map((option) => {
      return this.sentimentsService.predict(option.split(' '));
    });

    forkJoin(results$).pipe(first()).subscribe((results) => {
      this.$sentiments.set(results);
    });
  }

  createOption(event?: any) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.newOption.invalid) return;

    this.addOption(this.newOption.value);
    this.newOption.reset();
  }

  createPoll() {
    if (this.pollForm.invalid) return;

    this.pollService.createPoll(this.pollForm.value as TPoll);
    this.pollCreated.emit();
  }

  deleteOption(index: number) {
    this.options.removeAt(index);
  }

  private addOption(option: string) {
    const control = this.fb.control(option, [Validators.required]);
    this.options.push(control);
  }
}
