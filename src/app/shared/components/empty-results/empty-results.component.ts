import { booleanAttribute, Component, computed, CUSTOM_ELEMENTS_SCHEMA, Input, input } from '@angular/core';

@Component({
  selector: 'ev-empty-results',
  standalone: true,
  template: `
    <div class="py-4 text-center">
      <div>
        <lord-icon src="{{config().src}}" trigger="loop"
                   colors="primary:#405189,secondary:#0ab39c" style="width:72px;height:72px">
        </lord-icon>
      </div>
      <div class="mt-4">
        <h5>{{ config().text }}</h5>
      </div>
    </div>
  `,
  host: {
    class: 'd-block w-100'
  },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmptyResultsComponent {
  isLoading = input.required({ transform: booleanAttribute });
  @Input() emptyIcon = 'msoeawqm';

  config = computed(() => {
    const isLoading = this.isLoading();

    return {
      src: 'https://cdn.lordicon.com/' + (isLoading ? 'exzdkxpg' : this.emptyIcon) + '.json',
      text: isLoading ? 'Loading...' : 'Sorry! No Result Found',
    };
  });
}
