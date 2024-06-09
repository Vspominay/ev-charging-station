import { NgOptimizedImage } from '@angular/common';
import { booleanAttribute, Component, computed, CUSTOM_ELEMENTS_SCHEMA, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-invite',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgbCarousel,
    NgbSlide,
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './confirm-invite.component.html'
})
export default class ConfirmInviteComponent {
  private readonly $successInvite = signal(true);

  readonly $vm = computed(() => {
    const isSuccess = this.$successInvite();

    const title = isSuccess ? 'Well done!' : 'Oops, something went wrong';
    const message = isSuccess ? 'You have successfully confirmed your invite!' : 'Sorry, something went wrong. Please contact to depot administrator';
    const iconName = isSuccess ? 'gqjpawbc' : 'usownftb';
    const icon = `https://cdn.lordicon.com/${iconName}.json`;

    return { title, message, icon, isSuccess };
  });

  @Input() set successInvite(value: boolean) {
    this.$successInvite.set(booleanAttribute(value));
  }
}
